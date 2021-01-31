import React from 'react';
import { ApiHelper, DisplayBox, RoleInterface, RoleEdit, UserHelper } from './components';
import { Link } from 'react-router-dom'
import { Row, Col, Table } from 'react-bootstrap';
import { RouteComponentProps } from "react-router-dom";
import { Redirect } from 'react-router-dom';
import UserContext from '../UserContext';
import { Permissions } from '../helpers'

type TParams = { id?: string, app?: string };

export const AppAccess = ({ match }: RouteComponentProps<TParams>) => {
    const [roles, setRoles] = React.useState<RoleInterface[]>([]);
    const [selectedRoleId, setSelectedRoleId] = React.useState(-1);
    const [redirectUrl, setRedirectUrl] = React.useState<string>("");
    const context = React.useContext(UserContext);

    const loadData = async () => {
        const churchId = parseInt(match.params.id, 0);
        if (churchId !== UserHelper.currentChurch.id) await UserHelper.selectChurch(context, churchId).then(() => { setRedirectUrl("/settings/"); });
        ApiHelper.get('/roles/app/' + match.params.app, "AccessApi").then(data => setRoles(data));
    }
    const getEditContent = () => {
        if (!UserHelper.checkAccess(Permissions.accessApi.roles.edit)) return null;
        else return (<a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setSelectedRoleId(0); }} ><i className="fas fa-plus"></i></a>);
    }

    const getRows = () => {
        var result = [];
        const canEdit = UserHelper.checkAccess(Permissions.accessApi.roles.edit);
        for (let i = 0; i < roles.length; i++) {
            const editLink = (canEdit) ? (<a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setSelectedRoleId(roles[i].id); }}><i className="fas fa-pencil-alt"></i></a>) : null;
            result.push(<tr>
                <td><i className="fas fa-lock" /> <Link to={"/churches/" + match.params.id + "/" + match.params.app + "/" + roles[i].id}>{roles[i].name}</Link></td>
                <td>{editLink}</td>
            </tr>);
        }
        return result;
    }

    const handleUpdate = () => { loadData(); setSelectedRoleId(-1); }

    const getSidebar = () => {
        if (selectedRoleId === -1) return <></>
        else return (<RoleEdit roleId={selectedRoleId} updatedFunction={handleUpdate} appName={match.params.app} ></RoleEdit>)
    }

    React.useEffect(() => { loadData() });

    if (!UserHelper.checkAccess(Permissions.accessApi.roles.view)) return (<></>);
    if (redirectUrl !== '') return <Redirect to={redirectUrl}></Redirect>;
    else return (
        <>
            <h1><i className="fas fa-lock"></i> Roles</h1>
            <Row>
                <Col lg={8}>
                    <DisplayBox id="rolesBox" headerText="Roles" headerIcon="fas fa-lock" editContent={getEditContent()} >
                        <Table id="roleMemberTable">
                            <thead><tr><th>Name</th><th></th></tr></thead>
                            <tbody>{getRows()}</tbody>
                        </Table>
                    </DisplayBox>
                </Col>
                <Col lg={4}>{getSidebar()}</Col>
            </Row>
        </>
    );
}

