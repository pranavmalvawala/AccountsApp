import React from 'react';
import { InputBox, RoleInterface } from '.'
import { FormGroup, Form } from 'react-bootstrap';
import { ApiHelper, RoleMemberInterface, UserHelper, LoadCreateUserRequestInterface, PersonInterface, HouseholdInterface, UniqueIdHelper, AssociatePerson, ErrorMessages, UserInterface, SuggestPerson } from './';

interface Props {
    role: RoleInterface,
    updatedFunction: () => void,
    selectedUser: string,
}

export const UserAdd: React.FC<Props> = (props) => {
    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");
    const [fetchedUser, setFetchedUser] = React.useState<UserInterface>(null);
    const [errors, setErrors] = React.useState([]);
    const [linkedPerson, setLinkedPerson] = React.useState<PersonInterface>(null)
    const [linkNewPerson, setLinkNewPerson] = React.useState<PersonInterface>(null);
    const [checkForSuggestions, setCheckForSuggestion] = React.useState<Date>(null);

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
        if (!linkedPerson) {
            await createPerson(user.id);
        } else  if (linkNewPerson) {
            // unlink the old person and link the new one
            linkedPerson.userId = "";
            linkNewPerson.userId = user.id;    
            await ApiHelper.post("/people", [linkedPerson, linkNewPerson], "MembershipApi")
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
        setErrors([]);
        setLinkNewPerson(person);
        if (person.userId) {
            setErrors([<><b>{person?.name.display}</b> is already linked with other user. Press <b>save</b> only if you are sure about removing that link and associate it to <b>{email}</b>.</>])
        }
    }

    React.useEffect(loadData, [props.selectedUser]);

    const message = !linkedPerson && !linkNewPerson && (<span><small>* If you do not link anyone, a new person with these details will be created.</small></span>);

    return (
        <InputBox headerIcon="fas fa-lock" headerText={"Add to " + props.role.name} saveFunction={handleSave} cancelFunction={props.updatedFunction}  >
            <ErrorMessages errors={errors} />
            <FormGroup>
                <label>Name</label>
                <input type="text" name="name" value={name} onChange={handleChange} placeholder="John Smith" className="form-control" />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </FormGroup>
            <FormGroup>
                <label>Email</label>
                <input type="email" name="email" value={email} onChange={handleChange} onBlur={() => setCheckForSuggestion(new Date())} className="form-control" />
            </FormGroup>        
            <FormGroup>
                <label>Associate Person</label>
                <SuggestPerson person={linkedPerson || linkNewPerson} handleAssociatePerson={handleAssociatePerson} email={email} callNow={checkForSuggestions} />
                <AssociatePerson person={linkNewPerson || linkedPerson} handleAssociatePerson={handleAssociatePerson} />
            </FormGroup>
            {message}            
        </InputBox>
    );
}