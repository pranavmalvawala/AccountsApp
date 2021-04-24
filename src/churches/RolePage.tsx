import React, { useState } from 'react';
import { ApiHelper, RoleInterface, UserAdd, UserHelper, Permissions, RoleMemberInterface, BreadCrumb, BreadCrumbProps } from './components';
import { RouteComponentProps } from 'react-router-dom'
import { RoleMembers } from './components/RoleMembers';
import { RolePermissions } from './components/RolePermissions';
import { Row, Col } from 'react-bootstrap';

type TParams = { roleId?: string };

export const RolePage = ({ match }: RouteComponentProps<TParams>) => {
    const [role, setRole] = React.useState<RoleInterface>({} as RoleInterface);
    const [showAdd, setShowAdd] = React.useState<boolean>(false);
    const [selectedRoleMemberId, setSelectedRoleMemberId] = React.useState<string>("");
    const [roleMembers, setRoleMembers] = useState<RoleMemberInterface[]>([]);
    const church = UserHelper.currentChurch;

    const handleShowAdd = (role: RoleInterface) => { setShowAdd(true); }
    const handleAdd = () => { setShowAdd(false); setSelectedRoleMemberId(""); loadData(); loadRoleMembers(); }

    const loadData = () => { ApiHelper.get('/roles/' + match.params.roleId, "AccessApi").then(data => setRole(data)); }
    const loadRoleMembers = () => { ApiHelper.get('/rolemembers/roles/' + match.params.roleId + '?include=users', "AccessApi").then((data: any) => { setRoleMembers(data); }); }

    const getAddUser = () => {
        if (showAdd || selectedRoleMemberId) return <UserAdd role={role} roleMembers={roleMembers} selectedUser={selectedRoleMemberId} updatedFunction={handleAdd} />;
        return null;
    }

    const getSidebar = () => {
        if (!UserHelper.checkAccess(Permissions.accessApi.roles.edit)) return (null);
        else return (<>
            {getAddUser()}
            <RolePermissions role={role} />
        </>);
    }

    React.useEffect(loadData, []);
    React.useEffect(loadRoleMembers, [])

    const items: BreadCrumbProps[] = [
        { name: 'churches', to: '/churches' },
        { name: church?.name, to: `/churches/${church?.id}` },
        { name: 'Manage', to: `/churches/${church?.id}/manage` },
        { name: role?.name, to: `/churches/${church?.id}/role/${role?.id}`, active: true }
    ]

    if (!UserHelper.checkAccess(Permissions.accessApi.roles.view)) return (<></>);
    else {
        return (
            <>
                <BreadCrumb items={items} />
                <h1><i className="fas fa-lock"></i> {role.name}</h1>
                <Row>
                    <Col lg={8}>
                        <RoleMembers 
                            role={role} 
                            roleMembers={roleMembers} 
                            addFunction={handleShowAdd} 
                            setSelectedRoleMember={setSelectedRoleMemberId}
                            updatedFunction={handleAdd}
                        />
                    </Col>
                    <Col lg={4}>{getSidebar()}</Col>
                </Row>
            </>
        );
    }
}

