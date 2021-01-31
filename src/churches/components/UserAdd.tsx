import React from 'react';
import { InputBox, RoleInterface } from '.'
import { FormGroup } from 'react-bootstrap';
import { ApiHelper, RoleMemberInterface, UserHelper, LoadCreateUserRequestInterface } from './';

interface Props {
    role: RoleInterface,
    updatedFunction: () => void
}

export const UserAdd: React.FC<Props> = (props) => {
    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");

    const handleSave = () => {
        var req: LoadCreateUserRequestInterface = { userName: name, userEmail: email };


        ApiHelper.post('/users/loadOrCreate', req, "AccessApi").then(u => {
            const rm: RoleMemberInterface = { userId: u.id, roleId: props.role.id, churchId: UserHelper.currentChurch.id };
            ApiHelper.post('/rolemembers/', [rm], "AccessApi").then(() => {
                props.updatedFunction()
            });
        });
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

    return (
        <InputBox headerIcon="fas fa-lock" headerText={"Add to " + props.role.name} saveFunction={handleSave} cancelFunction={props.updatedFunction}  >
            <FormGroup>
                <label>Name</label>
                <input type="text" name="name" value={name} onChange={handleChange} className="form-control" />
            </FormGroup>
            <FormGroup>
                <label>Email</label>
                <input type="email" name="email" value={email} onChange={handleChange} className="form-control" />
            </FormGroup>
        </InputBox>
    );
}