import React, { useState, useCallback } from 'react';
import { ApiHelper, DisplayBox, RoleInterface, RolePermissionInterface, RoleCheck, PermissionInterface } from './';
import { Accordion, Card } from 'react-bootstrap';

interface Props { role: RoleInterface }

export const RolePermissions: React.FC<Props> = (props) => {
    const [rolePermissions, setRolePermissions] = useState<RolePermissionInterface[]>([]);
    const [permissions, setPermissions] = useState<PermissionInterface[]>([]);

    const loadData = useCallback(() => { ApiHelper.get('/rolepermissions/roles/' + props.role.id, "AccessApi").then(data => setRolePermissions(data)); }, [props.role]);
    const loadPermissions = useCallback(() => { 
            ApiHelper.get('/permissions', "AccessApi").then(data => setPermissions(data));
    }, []);

    const getSections = () => {
        const lastSection: string[] = [];
        const result: JSX.Element[] = []
        const sortedPermissions = [...permissions].sort((a, b) => a.displaySection > b.displaySection ? 1 : -1);

        sortedPermissions.forEach(p => {
            if (!lastSection.includes(p.displaySection)) {
                result.push(
                    <Card key={p.displaySection}>
                        <Accordion.Toggle as={Card.Header} style={{ cursor: 'pointer' }} eventKey={p.displaySection}>
                            {p.displaySection}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={p.displaySection}>
                            <Card.Body>{getChecks(p.displaySection)}</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                  );
                lastSection.push(p.displaySection);
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

    React.useEffect(() => { if (props.role?.id !== undefined) loadData(); }, [props.role, loadData]);
    React.useEffect(() => { if (props.role?.id !== undefined) loadPermissions() }, [props.role, loadPermissions]);

    return (
        <DisplayBox id="rolePermissionsBox" headerText="Edit Permissions" headerIcon="fas fa-lock" >
            <Accordion>
                {getSections()}
            </Accordion>
        </DisplayBox>
    );
}
