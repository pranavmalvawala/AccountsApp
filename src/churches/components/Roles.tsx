import React, { useState, useEffect, useContext } from "react"
import { Table } from "react-bootstrap"
import { useParams, Link } from "react-router-dom"
import { DisplayBox, UserHelper, ApiHelper, Permissions, ChurchInterface } from "."
import { RoleInterface } from "../../helpers"
import UserContext from "../../UserContext"

interface Props {
  selectRoleId: (id: string) => void;
  selectedRoleId: string;
  church: ChurchInterface;
}

export const Roles: React.FC<Props> = ({ selectRoleId, selectedRoleId, church }) => {
  const [roles, setRoles] = useState<RoleInterface[]>([]);
  const params = useParams();
  const context = useContext(UserContext);

  const loadData = () => {
    if (selectedRoleId !== "notset") return;
    const churchId = params.id;
    if (churchId !== UserHelper.currentChurch.id) UserHelper.selectChurch(context, churchId);
    ApiHelper.get(`/roles/church/${churchId}`, "AccessApi").then(roles => setRoles(roles));
  }

  const getEditContent = () => {
    if (!UserHelper.checkAccess(Permissions.accessApi.roles.edit)) return null;
    else return (<a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); selectRoleId("") }}><i className="fas fa-plus"></i></a>);
  }

  const getRows = () => {
    const result: JSX.Element[] = [];
    const sortedRoles = [...roles].sort((a, b) => a.name > b.name ? 1 : -1);
    const churchId = params.id;
    const canEdit = UserHelper.checkAccess(Permissions.accessApi.roles.edit);

    if (UserHelper.checkAccess(Permissions.accessApi.rolePermissions.edit)) {
      result.push(
        <tr key="everyone">
          <td><i className="fas fa-user-friends" /> <Link to={`/${churchId}/role/everyone`}>(Everyone)</Link></td>
          <td></td>
        </tr>
      );
    }

    sortedRoles.forEach(role => {
      const editLink = (canEdit) ? (<a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); selectRoleId(role.id) }}><i className="fas fa-pencil-alt"></i></a>) : null;

      result.push(<tr key={role.id}>
        <td><i className="fas fa-lock" /> <Link to={`/${churchId}/role/${role.id}`}>{role.name}</Link></td>
        <td>{editLink}</td>
      </tr>);
    });

    return result;
  }

  useEffect(loadData, [selectedRoleId, church]); //eslint-disable-line

  return (
    <DisplayBox id="rolesBox" headerText="Roles" headerIcon="fas fa-lock" editContent={getEditContent()}>
      <Table id="roleMemberTable">
        <thead><tr><th>Name</th><th></th></tr></thead>
        <tbody>{getRows()}</tbody>
      </Table>
    </DisplayBox>
  )
}
