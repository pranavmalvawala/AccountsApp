import React from "react";
import { ApiHelper, DisplayBox, UserHelper, RoleMemberInterface, RoleInterface, Permissions } from "./";
import { Table } from "react-bootstrap";

interface Props {
    role: RoleInterface,
    addFunction: (role: RoleInterface) => void,
    setSelectedRoleMember: (id: string) => void,
    roleMembers: RoleMemberInterface[],
    updatedFunction: () => void,
}

export const RoleMembers: React.FC<Props> = (props) => {
  const { roleMembers } = props;
  const isRoleEveryone = props.role.id === null;
  const getEditContent = () => {
    if (isRoleEveryone) return null;
    return <a href="about:blank" onClick={handleAdd}><i className="fas fa-plus"></i></a>
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    props.addFunction(props.role);
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm(`Are you sure you wish to delete this user from ${props.role.name}?`)) {
      const anchor = e.currentTarget as HTMLAnchorElement;
      const idx = parseInt(anchor.getAttribute("data-index"));
      const members = [...roleMembers];
      const member = members.splice(idx, 1)[0];
      ApiHelper.delete("/rolemembers/" + member.id, "AccessApi").then(() => props.updatedFunction());
    }

  }

  const getRows = () => {
    let canEdit = UserHelper.checkAccess(Permissions.accessApi.roleMembers.edit);
    let rows: JSX.Element[] = [];
    if (isRoleEveryone) {
      rows.push(<tr><td key="0">This role applies to all the members of the church.</td></tr>)
      return rows;
    }

    for (let i = 0; i < roleMembers.length; i++) {
      const rm = roleMembers[i];
      const removeLink = (canEdit) ? <a href="about:blank" onClick={handleRemove} data-index={i} className="text-danger"><i className="fas fa-user-times"></i></a> : <></>
      const editLink = (canEdit) ? (<a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); props.setSelectedRoleMember(rm.userId) }}><i className="fas fa-pencil-alt"></i></a>) : null;

      rows.push(
        <tr key={i}>
          <td>{rm.user.displayName}</td>
          <td>{rm.user.email}</td>
          <td>{editLink}</td>
          <td>{removeLink}</td>
        </tr>,
      );
    }
    return rows;
  }

  const getTableHeader = () => {
    if (isRoleEveryone) return null;

    return (<tr><th>Name</th><th>Email</th><th>Edit</th><th>Remove</th></tr>);
  }

  return (
    <DisplayBox id="roleMembersBox" headerText="Members" headerIcon="fas fa-users" editContent={getEditContent()}>
      <Table id="roleMemberTable">
        <thead>{getTableHeader()}</thead>
        <tbody>{getRows()}</tbody>
      </Table>
    </DisplayBox>
  );

}

