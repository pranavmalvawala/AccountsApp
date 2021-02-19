import React from 'react';
import { Row, Col } from 'react-bootstrap'
import UserContext from '../UserContext';
import { DisplayBox, ChurchInterface, ApiHelper, UserHelper, EnvironmentHelper, ChurchSettings, ChurchApps, ChurchAppInterface, Permissions } from './components'
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from "react-router-dom";

type TParams = { id?: string };

export const ChurchPage = ({ match }: RouteComponentProps<TParams>) => {

    const [church, setChurch] = React.useState<ChurchInterface>(null);
    const [churchApps, setChurchApps] = React.useState<ChurchAppInterface[]>([]);
    const [redirectUrl, setRedirectUrl] = React.useState<string>("");
    const context = React.useContext(UserContext);

    const loadData = () => {
        const churchId = match.params.id;
        if (churchId !== UserHelper.currentChurch.id) UserHelper.selectChurch(context, churchId).then(() => { setRedirectUrl("/settings/"); });
        else {
            ApiHelper.get('/churches/' + match.params.id + "?include=permissions", "AccessApi").then(data => setChurch(data));
            ApiHelper.get('/churchApps/', "AccessApi").then(data => { console.log(data); setChurchApps(data) });
        }

    }

    const handleChurchUpdated = () => {
        loadData();
    }


    const getAppRows = () => {
        const result: JSX.Element[] = [];
        if (church !== null) {
            churchApps?.forEach(app => {
                result.push(<tr>
                    <td>{app.appName}</td>
                    <td>{getLoginLink(church, app.appName)}</td>
                </tr>);
            });
        }
        return result;
    }




    const getLoginLink = (church: ChurchInterface, appName: string) => {
        const jwt = ApiHelper.getConfig("AccessApi").jwt;
        var result: JSX.Element = null;
        switch (appName) {
            case "CHUMS":
                result = (<a href={EnvironmentHelper.ChumsUrl + "/login/?jwt=" + jwt + "&churchId=" + church.id.toString()} rel="external noopener noreferrer " target="_blank" ><i className="fas fa-external-link-alt"></i></a>);
                break;
            case "StreamingLive":
                result = (<a href={EnvironmentHelper.StreamingLiveUrl + "/login/?jwt=" + jwt + "&churchId=" + church.id.toString()} rel="external noopener noreferrer" target="_blank"><i className="fas fa-external-link-alt"></i></a>);
                break;
        }
        return result;
    }

    const getSidebar = () => {
        if (!UserHelper.checkAccess(Permissions.accessApi.settings.edit)) return null;
        else return (<ChurchSettings church={church} updatedFunction={handleChurchUpdated} />);
    }

    const getApps = () => {
        if (!UserHelper.checkAccess(Permissions.accessApi.settings.edit)) return null;
        else return (<ChurchApps church={church} redirectFunction={setRedirectUrl} updatedFunction={handleChurchUpdated} />);
    }


    React.useEffect(loadData, [match.params.id]);

    if (redirectUrl !== '') return <Redirect to={redirectUrl}></Redirect>;
    else return (
        <>
            <Row style={{ marginBottom: 25 }}>
                <div className="col"><h1 style={{ borderBottom: 0, marginBottom: 0 }}><i className="fas fa-church"></i> {church?.name || ""}</h1></div>
            </Row>
            <Row>
                <Col md={8}>
                    <DisplayBox headerIcon="fas fa-key" headerText="Your Access">
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th>App</th>
                                    <th>Actions</th>
                                </tr>
                                {getAppRows()}
                            </thead>
                        </table>
                    </DisplayBox>

                    {getApps()}

                </Col>
                <Col md={4}>
                    {getSidebar()}
                </Col>
            </Row>
        </>
    );
}
