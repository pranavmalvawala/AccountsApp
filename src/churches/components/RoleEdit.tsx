import React, { useState } from 'react';
import { ApiHelper, InputBox, RoleInterface, UniqueIdHelper, ErrorMessages } from './';

interface Props {
    roleId: string,
    updatedFunction: () => void
}


export const RoleEdit: React.FC<Props> = (props) => {
    const [role, setRole] = useState<RoleInterface>({} as RoleInterface);
    const [errors, setErrors] = useState<string[]>([]);

    const loadData = () => {
        if (!UniqueIdHelper.isMissing(props.roleId)) ApiHelper.get('/roles/' + props.roleId, "AccessApi").then((data: RoleInterface) => setRole(data));
        else setRole({} as RoleInterface);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        var r = { ...role };
        r.name = e.currentTarget.value;

        setRole(r);
        setErrors([]);
    }

    const handleSave = () => {
        if (!role.name?.trim()) {
            setErrors(['Please enter a valid role name.'])
            return;
        }

        const r = { 
            ...role,
            name: role.name.trim() 
        };
        ApiHelper.post('/roles', [r], "AccessApi").then(() => props.updatedFunction());
    }
    const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === 'Enter') { e.preventDefault(); handleSave(); } }
    const handleCancel = () => props.updatedFunction();
    const handleDelete = () => {
        if (window.confirm('Are you sure you wish to permanently delete this role?')) {
            ApiHelper.delete('/roles/' + role.id, "AccessApi").then(() => props.updatedFunction());
        }
    }

    React.useEffect(loadData, [props.roleId]);


    return (
        <InputBox id="roleBox" headerIcon="fas fa-lock" headerText="Edit Role" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={(!UniqueIdHelper.isMissing(props.roleId)) ? handleDelete : undefined} >
            <ErrorMessages errors={errors} />
            <div className="form-group">
                <label>Role Name</label>
                <input type="text" className="form-control" value={role.name || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
            </div>
        </InputBox>
    );
}
