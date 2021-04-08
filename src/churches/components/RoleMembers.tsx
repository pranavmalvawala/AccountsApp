import React from 'react';
import { ApiHelper, DisplayBox, UserHelper, RoleMemberInterface, RoleInterface, Permissions } from './';
import { Table } from 'react-bootstrap';


interface Props { role: RoleInterface, addFunction: (role: RoleInterface) => void, setSelectedRoleMember: (id: string) => void }

export const RoleMembers: React.FC<Props> = (props) => {

    const [roleMembers, setRoleMembers] = React.useState<RoleMemberInterface[]>([]);

    const loadData = React.useCallback(() => {
        ApiHelper.get('/rolemembers/roles/' + props.role.id + '?include=users', "AccessApi").then((data: any) => { setRoleMembers(data); });
    }, [props.role]);

    const getEditContent = () => { return <a href="about:blank" onClick={handleAdd}><i className="fas fa-plus"></i></a> }

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        props.addFunction(props.role);
    }

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        if (window.confirm(`Are you sure you wish to delete this user from ${props.role.name}?`)) {
            var anchor = e.currentTarget as HTMLAnchorElement;
            var idx = parseInt(anchor.getAttribute('data-index'));
            var members = [...roleMembers];
            var member = members.splice(idx, 1)[0];
            setRoleMembers(members);
            ApiHelper.delete('/rolemembers/' + member.id, "AccessApi");
        }

    }

    const getRows = () => {
        var canEdit = UserHelper.checkAccess(Permissions.accessApi.roleMembers.edit);
        var rows = [];
        for (let i = 0; i < roleMembers.length; i++) {
            const rm = roleMembers[i];
            const removeLink = (canEdit) ? <a href="about:blank" onClick={handleRemove} data-index={i} className="text-danger" ><i className="fas fa-user-times"></i></a> : <></>
            const editLink = (canEdit) ? (<a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); props.setSelectedRoleMember(rm.userId) }}><i className="fas fa-pencil-alt"></i></a>) : null;

            rows.push(
                <tr key={i}>
                    <td>{rm.user.displayName}</td>
                    <td>{rm.user.email}</td>                    
                    <td>{editLink}</td>
                    <td>{removeLink}</td>
                </tr>
            );
        }
        return rows;
    }


    React.useEffect(() => { if (props.role.id !== undefined) loadData(); }, [props.role, loadData]);

    return (
        <DisplayBox id="roleMembersBox" headerText="Members" headerIcon="fas fa-users" editContent={getEditContent()} >
            <Table id="roleMemberTable">
                <thead><tr><th>Name</th><th>Email</th><th>Edit</th><th>Remove</th></tr></thead>
                <tbody>{getRows()}</tbody>
            </Table>
        </DisplayBox>
    );

}

