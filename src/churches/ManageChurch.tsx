import React from 'react';
import { Row, Col } from 'react-bootstrap'
import UserContext from '../UserContext';
import { ChurchInterface, ApiHelper, UserHelper, ChurchSettings, ChurchApps, Permissions, Appearance, Preview } from './components'
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from "react-router-dom";

type TParams = { id?: string };

export const ManageChurch = ({ match }: RouteComponentProps<TParams>) => {
    const [ts, setTs] = React.useState(Date.now());
    const [church, setChurch] = React.useState<ChurchInterface>(null);
    const [redirectUrl, setRedirectUrl] = React.useState<string>("");
    const context = React.useContext(UserContext);

    const loadData = () => {
        const churchId = match.params.id;
        if (churchId !== UserHelper.currentChurch.id) UserHelper.selectChurch(context, churchId);
        if (!UserHelper.checkAccess(Permissions.accessApi.settings.edit)) setRedirectUrl("/churches/" + church.id);
        ApiHelper.get('/churches/' + match.params.id + "?include=permissions", "AccessApi").then(data => setChurch(data));
    }

    const handleChurchUpdated = () => {
        loadData();
    }

    const updatePreview = () => {
        setTs(Date.now());
    }

    React.useEffect(loadData, [match.params.id]);

    if (redirectUrl !== '') return <Redirect to={redirectUrl}></Redirect>;
    else return (
        <>
            <Row style={{ marginBottom: 25 }}>
                <div className="col"><h1 style={{ borderBottom: 0, marginBottom: 0 }}><i className="fas fa-church"></i> Manage: {church?.name || ""}</h1></div>
            </Row>
            <Row>
                <Col md={8}>
                    <ChurchSettings church={church} updatedFunction={handleChurchUpdated} />
                </Col>
                <Col md={4}>
                    <ChurchApps church={church} redirectFunction={setRedirectUrl} updatedFunction={handleChurchUpdated} />
                </Col>
            </Row>
            <Row>
                <Col md={8}>
                    <Preview ts={ts} />
                </Col>
                <Col md={4}>
                    <Appearance updatedFunction={updatePreview} enableEdit={true} />
                </Col>
            </Row>
        </>
    );
}
