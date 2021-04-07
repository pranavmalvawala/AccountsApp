import React from 'react';
import { InputBox, RoleInterface } from '.'
import { FormGroup, Table, Form, Alert } from 'react-bootstrap';
import { ApiHelper, RoleMemberInterface, UserHelper, LoadCreateUserRequestInterface, PersonAdd, PersonInterface, HouseholdInterface, UniqueIdHelper, PersonHelper } from './';
import { UserInterface } from '../../helpers';

interface Props {
    role: RoleInterface,
    updatedFunction: () => void,
    selectedUser: string,
}

export const UserAdd: React.FC<Props> = (props) => {
    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");
    const [fetchedUser, setFetchedUser] = React.useState<UserInterface>(null);
    const [showAssociatedWith, setShowAssociatedWith] = React.useState<boolean>(false);
    const [showAlert, setShowAlert] = React.useState<boolean>(false);
    const [linkedPerson, setLinkedPerson] = React.useState<PersonInterface>(null)
    const [linkNewPerson, setLinkNewPerson] = React.useState<PersonInterface>(null);
    const [suggestedPerson, setSuggestedPerson] = React.useState<PersonInterface>(null);

    const handleSave = async () => {
        var req: LoadCreateUserRequestInterface = { userName: name, userEmail: email };

        let user = {...fetchedUser};
        if (!fetchedUser) {
            user = await ApiHelper.post('/users/loadOrCreate', req, "AccessApi");

            const rm: RoleMemberInterface = { userId: user.id, roleId: props.role.id, churchId: UserHelper.currentChurch.id };
            await ApiHelper.post('/rolemembers/', [rm], "AccessApi");
        }

        if (!linkedPerson) {
            await createPerson(user.id);
            props.updatedFunction();
            return;
        }
        linkedPerson.userId = "";
        linkNewPerson.userId = user.id;

        ApiHelper.post("/people", [linkedPerson, linkNewPerson], "MembershipApi").then(() => {
            props.updatedFunction();
        })
    }

    const createPerson = async (userId: string) => {
        const house = { name } as HouseholdInterface
        const households = await ApiHelper.post("/households", [house], "MembershipApi")
        
        const names = name.split(' ');
        const personRecord: PersonInterface = { householdId: households[0].id, name: { first: names[0], last: names[1] }, userId }
        const person = await ApiHelper.post("/people", [personRecord], "MembershipApi")

        return person[0];
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch (e.currentTarget.name) {
            case "email":
                setEmail(e.currentTarget.value);
                break;
            case "name":
                setName(e.currentTarget.value);
                break;
        }
    }

    const checkForSuggestions = () => {
        if (!linkedPerson) {
            setSuggestedPerson(null)
            ApiHelper.get(`/people/search?email=${email}`, "MembershipApi").then(person => {
                setSuggestedPerson(person[0]);
            })
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
                    setShowAssociatedWith(true);
                }
            })
        }
    }

    const handleAssociatePerson = (person: PersonInterface) => {
        setShowAlert(false);
        setShowAssociatedWith(true);
        setLinkNewPerson(person);
        if (person.userId) {
            setShowAlert(true);
        }
    }

    React.useEffect(loadData, [props.selectedUser]);
    React.useEffect(checkForSuggestions, [email]);

    const associatedWith = showAssociatedWith ? (
        <Table size="sm">
            <tbody>
                <tr>
                    <td className="border-0"><img src="/images/sample-profile.png" width="60px" height="45px" style={{borderRadius: "5px"}} alt="avatar" /></td>
                    <td className="border-0">{linkNewPerson?.name?.display || linkedPerson.name.display}</td>
                    <td className="border-0"><a className="text-success" data-cy="change-person" href="about:blank" onClick={(e) => { e.preventDefault(); setShowAssociatedWith(false)}}><i className="fas fa-user"></i> Change</a></td>
                </tr>    
            </tbody>    
        </Table>
    ) : (
        <PersonAdd getPhotoUrl={PersonHelper.getPhotoUrl} addFunction={handleAssociatePerson} />
    )

    const message = !linkedPerson && !linkNewPerson && (<span><small>* If you do not link anyone, a new person with these details will be created.</small></span>);
    const personSuggestion = !linkedPerson && !linkNewPerson && email && suggestedPerson && (
        <>
            <p><small><em>suggestion</em></small></p>
            <Table size="sm">
            <tbody>
                <tr>
                    <td><img src="/images/sample-profile.png" width="60px" height="45px" style={{borderRadius: "5px"}} alt="avatar" /></td>
                    <td>{suggestedPerson?.name.display}</td>
                    <td><a className="text-success" data-cy="change-person" href="about:blank" onClick={(e) => { e.preventDefault(); handleAssociatePerson(suggestedPerson)}}><i className="fas fa-user"></i> Add</a></td>
                </tr>    
            </tbody>    
        </Table>
        </>
    )

    return (
        <InputBox headerIcon="fas fa-lock" headerText={"Add to " + props.role.name} saveFunction={handleSave} cancelFunction={props.updatedFunction}  >
            {showAlert && <Alert variant="warning"><b>{linkNewPerson?.name.display}</b> is already linked with other user. Press <b>save</b> only if you are sure about removing that link and associate it to <b>{email}</b>.</Alert>}
            <FormGroup>
                <label>Name</label>
                <input type="text" name="name" value={name} onChange={handleChange} placeholder="John Smith" className="form-control" />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </FormGroup>
            <FormGroup>
                <label>Email</label>
                <input type="email" name="email" value={email} onChange={handleChange} className="form-control" />
            </FormGroup>        
            <FormGroup>
                <label>Associate Person</label>
                {personSuggestion}
                {associatedWith}
            </FormGroup>
            {message}            
        </InputBox>
    );
}