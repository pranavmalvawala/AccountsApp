import React from 'react';
import { ApiHelper, DisplayBox, RoleInterface, RolePermissionInterface, RoleCheck, PermissionInterface } from './';
import { Row, Col } from 'react-bootstrap';

interface Props { role: RoleInterface, appName: string }

export const RolePermissions: React.FC<Props> = (props) => {
    const [rolePermissions, setRolePermissions] = React.useState<RolePermissionInterface[]>([]);
    const [permissions, setPermissions] = React.useState<PermissionInterface[]>([]);

    const loadData = React.useCallback(() => { ApiHelper.get('/rolepermissions/roles/' + props.role.id, "AccessApi").then(data => setRolePermissions(data)); }, [props.role]);
    const loadPermissions = React.useCallback(() => { ApiHelper.get('/permissions/' + props.appName, "AccessApi").then(data => setPermissions(data)); }, [props.appName]);

    const getSections = () => {
        var lastSection = "";
        const result: JSX.Element[] = []
        permissions.forEach(p => {
            if (p.displaySection !== lastSection) {
                result.push(
                    <Col xl={6} style={{ marginBottom: 14 }}>
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
        permissions.forEach(p => {
            if (p.displaySection === displaySection) {
                result.push(<RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} apiName={p.apiName} contentType={p.section} action={p.action} label={p.displayAction} />)
            }
        });
        return result;
    }

    React.useEffect(() => { if (props.role.id !== undefined) loadData() }, [props.role, loadData]);
    React.useEffect(() => { if (props.appName !== undefined) loadPermissions() }, [props.appName, loadPermissions]);

    return (
        <DisplayBox id="rolePermissionsBox" headerText="Edit Permissions" headerIcon="fas fa-lock" >
            <Row>
                {getSections()}
            </Row>
        </DisplayBox>
    );
}
