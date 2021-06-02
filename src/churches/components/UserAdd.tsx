import React, { useState, useCallback } from 'react';
import { InputBox, RoleInterface } from '.'
import { FormGroup } from 'react-bootstrap';
import { ApiHelper, RoleMemberInterface, UserHelper, LoadCreateUserRequestInterface, PersonInterface, HouseholdInterface, UniqueIdHelper, AssociatePerson, ErrorMessages, UserInterface, ValidateHelper } from './';

interface Props {
    role: RoleInterface,
    updatedFunction: () => void,
    selectedUser: string,
    roleMembers: RoleMemberInterface[];
}

export const UserAdd: React.FC<Props> = (props) => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [fetchedUser, setFetchedUser] = useState<UserInterface>(null);
    const [errors, setErrors] = useState([]);
    const [linkedPerson, setLinkedPerson] = useState<PersonInterface>(null)
    const [selectedPerson, setSelectedPerson] = useState<PersonInterface>(null);
    const [showEmailField, setShowEmailField] = useState<boolean>(false);
    const [showNameField, setShowNameField] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    const handleSave = async () => {
        // when edit mode
        if (editMode) {
            if (validateInputs()) {
                return
            }

            const user: UserInterface = {...fetchedUser, email, displayName: name};
            await ApiHelper.post("/users/updateUser", user, "AccessApi");
            let people: PersonInterface[] = []

            // link new one
            if (selectedPerson) {
                // unlink the old person
                if (linkedPerson.id) {
                    linkedPerson.userId = "";
                    people.push(linkedPerson)
                }
                selectedPerson.userId = user.id;
                people.push(selectedPerson);
            }
            await ApiHelper.post("/people", people, "MembershipApi");

            props.updatedFunction();
            return;
        }
        // creating a complete new user
        if (showNameField) {
            if (validateInputs()) {
                return;
            }
            const user = await createUserAndToGroup(name, email);
            await createPerson(user.id);
            props.updatedFunction();
            return;            
        }
        // creating users from already existing people
        if (showEmailField && !ValidateHelper.email(email)) {
            setErrors(["Please enter a valid Email"]);
            return;
        }
        if (!selectedPerson) return;
        const userEmail = showEmailField ? email : selectedPerson.contactInfo.email;
        const user = await createUserAndToGroup(selectedPerson.name.display, userEmail);
        // selectedPerson is already associated with a user
        if (user.id !== selectedPerson.userId) {
            selectedPerson.userId = user.id;
            if (showEmailField && !editMode) {
                selectedPerson.contactInfo.email = email;
            }
            await ApiHelper.post("/people", [selectedPerson], "MembershipApi");
        }
        props.updatedFunction();
        
    }

    const validateInputs = () => {
        const warnings: string[] = [];
        if (!ValidateHelper.shouldBeTwoWords(name)) warnings.push("Name should be 2 words");
        if (!ValidateHelper.email(email)) warnings.push("Enter a valid Email");
        setErrors(warnings);
        return warnings.length > 0;
    }

    const createUserAndToGroup = async (userName: string, userEmail: string) => {
        const userPayload: LoadCreateUserRequestInterface = { userName, userEmail };
        const user: UserInterface = await ApiHelper.post('/users/loadOrCreate', userPayload, "AccessApi");
        const roleMember: RoleMemberInterface = { userId: user.id, roleId: props.role.id, churchId: UserHelper.currentChurch.id };
        await ApiHelper.post('/rolemembers/', [roleMember], "AccessApi");

        return user;
    }

    const createPerson = async (userId: string) => {
        const house = { name } as HouseholdInterface
        const households = await ApiHelper.post("/households", [house], "MembershipApi")
        
        const names = name.split(' ');
        const personRecord: PersonInterface = { householdId: households[0].id, name: { first: names[0], last: names[1] }, userId, contactInfo: { email } }
        const person = await ApiHelper.post("/people", [personRecord], "MembershipApi")

        return person[0];
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrors([]);
        switch (e.currentTarget.name) {
            case "email":
                setEmail(e.currentTarget.value);
                break;
            case "name":
                setName(e.currentTarget.value);
                break;
        }
    }

    const loadData = () => {
        if (!UniqueIdHelper.isMissing(props.selectedUser)) {
            setEditMode(true);
            ApiHelper.get(`/users/${props.selectedUser}`, "AccessApi").then(user => {
                setFetchedUser(user);
                setName(user.displayName);
                setEmail(user.email);
            })
            ApiHelper.get(`/people/userid/${props.selectedUser}`, "MembershipApi").then(person => {
                if (person) {
                    setLinkedPerson(person);
                }
            }).catch(() => {
                setLinkedPerson(null);
            })
        }
    }

    const handleAssociatePerson = (person: PersonInterface) => {
        const filteredUser = props.roleMembers.filter(r => r.userId === person.userId);
        if (!editMode && filteredUser.length > 0) {
            window.alert("There already exist a role member associating with this person.");
            props.updatedFunction();
            return;
        }
        setSelectedPerson(person);
        if (editMode && person.userId && person.userId !== fetchedUser.id) {
            setErrors([<><b>{person?.name.display}</b> is already linked with other user. Press <b>save</b> only if you are sure about removing that link and associate it to <b>{email}</b>.</>])
        }
        if (person.userId) {
            return;
        }
        if (!person.contactInfo.email) {
            setShowEmailField(true);
        }
    }

    const CreateNewUser = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowNameField(true);
        setShowEmailField(true);
    }

    const handleSearchStatus = useCallback((value: boolean) => {
        setHasSearched(value);
    }, [])

    React.useEffect(loadData, [props.selectedUser]);

    const message = (!showNameField && !editMode && hasSearched) && (<span>Don't have a user account? <a href="about:blank" onClick={CreateNewUser}>Create New User</a></span>);
    const nameField = (showNameField || editMode) && (
        <FormGroup>
                <label>Name</label>
                <input type="text" name="name" value={name} onChange={handleChange} placeholder="John Smith" className="form-control" />
        </FormGroup>
    )
    const emailField = (showEmailField || editMode) && (
        <FormGroup>
            <label>Email</label>
            <input type="email" name="email" value={email} onChange={handleChange} className="form-control" />
        </FormGroup>
    )

    return (
        <InputBox headerIcon="fas fa-lock" headerText={"Add to " + props.role.name} saveFunction={handleSave} cancelFunction={props.updatedFunction}  >
            <ErrorMessages errors={errors} />        
            {
                (!showNameField || editMode) && (
                    <FormGroup>
                        <label>Associate Person</label>
                        <AssociatePerson 
                            person={selectedPerson || linkedPerson } 
                            handleAssociatePerson={handleAssociatePerson} 
                            searchStatus={handleSearchStatus} 
                        />
                    </FormGroup>
                )
            }
            {nameField}
            {emailField}   
            {message}            
        </InputBox>
    );
}