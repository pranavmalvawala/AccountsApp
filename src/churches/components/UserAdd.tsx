import React, { useState } from 'react';
import { InputBox, RoleInterface } from '.'
import { FormGroup, Form, Button } from 'react-bootstrap';
import { ApiHelper, RoleMemberInterface, UserHelper, LoadCreateUserRequestInterface, PersonInterface, HouseholdInterface, UniqueIdHelper, AssociatePerson, ErrorMessages, UserInterface, SuggestPerson, ValidateHelper } from './';

interface Props {
    role: RoleInterface,
    updatedFunction: () => void,
    selectedUser: string,
}

export const UserAdd: React.FC<Props> = (props) => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [fetchedUser, setFetchedUser] = useState<UserInterface>(null);
    const [errors, setErrors] = useState([]);
    const [linkedPerson, setLinkedPerson] = useState<PersonInterface>(null)
    const [linkNewPerson, setLinkNewPerson] = useState<PersonInterface>(null);
    const [checkForSuggestions, setCheckForSuggestion] = useState<Date>(null);
    const [selectedPerson, setSelectedPerson] = useState<PersonInterface>(null);
    const [showEmailField, setShowEmailField] = useState<boolean>(false);
    const [showNameField, setShowNameField] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);

    const handleSave = async () => {
        if (!validate()) return;

        var req: LoadCreateUserRequestInterface = { userName: name, userEmail: email };
        let user = {...fetchedUser, email, displayName: name};

        // create a new user
        if (!fetchedUser) {
            user = await ApiHelper.post('/users/loadOrCreate', req, "AccessApi");

            const rm: RoleMemberInterface = { userId: user.id, roleId: props.role.id, churchId: UserHelper.currentChurch.id };
            await ApiHelper.post('/rolemembers/', [rm], "AccessApi");
        } else {
            // here when editing user details so update displayName and email.
            await ApiHelper.post("/users/updateUser", user, "AccessApi");
        }
        
        // create a new person when no person is linked
        if (!linkedPerson && !linkNewPerson) {
            await createPerson(user.id);
        } else  if (linkNewPerson) {
            // unlink the old person and link the new one
            let people: PersonInterface[] = [];
            if (linkedPerson) {
                linkedPerson.userId = "";
                people.push(linkedPerson)
            }
            linkNewPerson.userId = user.id;
            people.push(linkNewPerson);    
            await ApiHelper.post("/people", people, "MembershipApi");
        }
        props.updatedFunction();
    }

    const handleNewSave = async () => {
        if (showNameField) {
            console.log('creating a whole new user...');

            const warnings: string[] = [];
            if (!ValidateHelper.shouldBeTwoWords(name)) warnings.push("Name should be 2 words");
            if (!ValidateHelper.email(email)) warnings.push("Enter a valid Email");
            setErrors(warnings);
            if (warnings.length > 0) return;
            
            console.log("create user now");
            const userPayload: LoadCreateUserRequestInterface = { userName: name, userEmail: email };
            const user: UserInterface = await ApiHelper.post('/users/loadOrCreate', userPayload, "AccessApi");
            const roleMember: RoleMemberInterface = { userId: user.id, roleId: props.role.id, churchId: UserHelper.currentChurch.id };
            await ApiHelper.post('/rolemembers/', [roleMember], "AccessApi");
            await createPerson(user.id);
            props.updatedFunction();

            return;

            
        }
            if (showEmailField && !ValidateHelper.email(email)) {
                setErrors(["Please enter a valid Email"]);
                return;
            }
            const userEmail = showEmailField ? email : selectedPerson.contactInfo.email;
            const userPayload: LoadCreateUserRequestInterface = { userName: selectedPerson.name.display, userEmail };
            console.log("user", userPayload);
            const user: UserInterface = await ApiHelper.post('/users/loadOrCreate', userPayload, "AccessApi");
            const roleMember: RoleMemberInterface = { userId: user.id, roleId: props.role.id, churchId: UserHelper.currentChurch.id };
            await ApiHelper.post('/rolemembers/', [roleMember], "AccessApi");
            // selectedPerson is already associated with a user
            if (user.id !== selectedPerson.userId) {
                selectedPerson.userId = user.id;
                selectedPerson.contactInfo.email = userEmail;
                console.log('person with user id', selectedPerson);
                await ApiHelper.post("/people", [selectedPerson], "MembershipApi");
            }

            props.updatedFunction();
        
    }

    const validate = (): boolean => {
        let warnings = [];

        if (!(name.trim().split(" ").length === 2)) warnings.push("Name format \"Firstname Lastname\"");
        if (!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email))) warnings.push("Please enter a valid Email");
        setErrors(warnings);

        return warnings.length === 0;
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
            setShowNameField(true);
            setShowEmailField(true);
            ApiHelper.get(`/users/${props.selectedUser}`, "AccessApi").then(user => {
                setFetchedUser(user);
                setName(user.displayName);
                setEmail(user.email);
            })
            ApiHelper.get(`/people/userid/${props.selectedUser}`, "MembershipApi").then(person => {
                if (person) {
                    setLinkedPerson(person);
                }
            }).catch(err => {
                setLinkedPerson(null);
            })
        }
    }

    const handleAssociatePerson = (person: PersonInterface) => {
        setSelectedPerson(person);
        if (person.userId) {
            return;
        }
        if (!person.contactInfo.email) {
            console.log("email not found");
            setShowEmailField(true);
        }
        // setErrors([]);
        // setLinkNewPerson(person);
        // if (person.userId) {
        //     setErrors([<><b>{person?.name.display}</b> is already linked with other user. Press <b>save</b> only if you are sure about removing that link and associate it to <b>{email}</b>.</>])
        // }
    }

    const CreateNewUser = () => {
        setShowNameField(true);
        setShowEmailField(true);
    }

    React.useEffect(loadData, [props.selectedUser]);

    const message = !linkedPerson && !linkNewPerson && (<span><small>* If you do not link anyone, a new person with these details will be created.</small></span>);
    const nameField = showNameField && (
        <FormGroup>
                <label>Name</label>
                <input type="text" name="name" value={name} onChange={handleChange} placeholder="John Smith" className="form-control" />
        </FormGroup>
    )

    return (
        <InputBox headerIcon="fas fa-lock" headerText={"Add to " + props.role.name} saveFunction={handleNewSave} cancelFunction={props.updatedFunction}  >
            <ErrorMessages errors={errors} />        
            {
                (!showNameField || editMode) && (
                    <FormGroup>
                        <label>Associate Person</label>
                        {/* <SuggestPerson person={linkedPerson || linkNewPerson} handleAssociatePerson={handleAssociatePerson} email={email} callNow={checkForSuggestions} /> */}
                        <AssociatePerson person={linkNewPerson || linkedPerson || selectedPerson} handleAssociatePerson={handleAssociatePerson} />
                    </FormGroup>
                )
            }
            {!showNameField && (<Button variant="primary" onClick={CreateNewUser}>Create new user</Button>)}
            {nameField}
            {
                showEmailField && (
                    <FormGroup>
                        <label>Email</label>
                        <input type="email" name="email" value={email} onChange={handleChange} className="form-control" />
                    </FormGroup>
                )
            }        
            
            {/* {message}             */}
        </InputBox>
    );
}