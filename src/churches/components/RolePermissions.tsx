import React, { useState, useCallback } from 'react';
import { ApiHelper, DisplayBox, RoleInterface, RolePermissionInterface, RoleCheck, PermissionInterface } from './';
import { Row, Col } from 'react-bootstrap';

interface Props { role: RoleInterface }

export const RolePermissions: React.FC<Props> = (props) => {
    const [rolePermissions, setRolePermissions] = useState<RolePermissionInterface[]>([]);
    const [permissions, setPermissions] = useState<PermissionInterface[]>([]);

    const loadData = useCallback(() => { ApiHelper.get('/rolepermissions/roles/' + props.role.id, "AccessApi").then(data => setRolePermissions(data)); }, [props.role]);
    const loadPermissions = useCallback(() => { 
            ApiHelper.get('/permissions', "AccessApi").then(data => setPermissions(data));
    }, []);

    const getSections = () => {
        var lastSection = "";
        const result: JSX.Element[] = []
        permissions.forEach((p, index) => {
            if (p.displaySection !== lastSection) {
                result.push(
                    <Col key={index} xl={6} style={{ marginBottom: 14 }}>
                        <div><b>{p.displaySection}:</b></div>
                        {getChecks(p.displaySection)}
                    </Col>
                )
                lastSection = p.displaySection;
            }
        });
        return result;
    }

    const getChecks = (displaySection: string) => {
        const result: JSX.Element[] = []
        permissions.forEach((p, index) => {
            if (p.displaySection === displaySection) {
                result.push(<RoleCheck key={index} roleId={props.role.id} rolePermissions={rolePermissions} apiName={p.apiName} contentType={p.section} action={p.action} label={p.displayAction} />)
            }
        });
        return result;
    }

    React.useEffect(() => { if (props.role.id !== undefined) loadData(); }, [props.role, loadData]);
    React.useEffect(() => { if (props.role.id) loadPermissions() }, [props.role, loadPermissions]);

    return (
        <DisplayBox id="rolePermissionsBox" headerText="Edit Permissions" headerIcon="fas fa-lock" >
            <Row>
                {getSections()}
            </Row>
        </DisplayBox>
    );
}
