import React from 'react';
import { ChurchInterface, DisplayBox, UserHelper, ChurchSettingsEdit, Permissions } from './';
import { Row, Col } from "react-bootstrap";

interface Props { church: ChurchInterface, updatedFunction: () => void }

export const ChurchSettings: React.FC<Props> = (props) => {

    const [mode, setMode] = React.useState('display');

    const handleEdit = () => setMode('edit');

    const handleUpdate = () => {
        setMode('display');
        props.updatedFunction();
    }

    const getEditFunction = () => {
        return (UserHelper.checkAccess(Permissions.accessApi.settings.edit)) ? handleEdit : null
    }

    const getDisplayAddress = () => {
        var result: JSX.Element[] = [];
        if (props.church !== null) {

            if (!isEmpty(props.church.address1)) result.push(<>{props.church.address1}<br /></>);
            if (!isEmpty(props.church.address2)) result.push(<>{props.church.address2}<br /></>);
            if (!isEmpty(props.church.city)) result.push(<>{props.church.city}, {props.church.state} {props.church.zip}<br /></>);
            if (!isEmpty(props.church.country)) result.push(<>{props.church.country}</>);
        }
        return (<>{result}</>);
    }

    const isEmpty = (value: any) => {
        return value === undefined || value === null || value === "";
    }

    if (mode === 'display') {
        return (
            <DisplayBox id="churchSettingsBox" headerIcon="fas fa-church" headerText="Church Settings" editFunction={getEditFunction()} >
                <Row>
                    <Col>
                        <label>Name</label><br />
                        {props.church?.name}<br /><br />
                    </Col>
                    <Col>
                        <label>Subdomain</label><br />
                        {props.church?.subDomain}
                    </Col>
                </Row>
                <label>Address</label><br />
                {getDisplayAddress()}<br /><br />
            </DisplayBox>
        );
    } else return <ChurchSettingsEdit church={props.church} updatedFunction={handleUpdate} />
}

