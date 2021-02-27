import React from 'react';
import { ChurchInterface, ApiHelper, DisplayBox, UserHelper } from "./components";
import { Row, Col, InputGroup, FormControl, Button } from 'react-bootstrap'
import UserContext from '../UserContext';
import { Redirect } from 'react-router-dom';

export const AdminPage = () => {
    const [searchText, setSearchText] = React.useState<string>('')
    const [churches, setChurches] = React.useState<ChurchInterface[]>([]);
    const [redirectUrl, setRedirectUrl] = React.useState<string>("");

    const loadData = () => {
        const term = escape(searchText.trim());
        ApiHelper.get("/churches/all?term=" + term, "AccessApi").then(data => setChurches(data));
    }

    const context = React.useContext(UserContext);

    const getChurchRows = () => {
        if (churches === null) return;
        const result: JSX.Element[] = [];
        churches.forEach((c, index) => {
            result.push(<tr key={index}>
                <td>{c.name}</td>
                <td>{getManageAccessLink(c, "CHUMS")}{getManageAccessLink(c, "StreamingLive")}</td>
            </tr>);
        });
        return result;
    }

    const getManageAccessLink = (church: ChurchInterface, appName: string) => {
        var result: JSX.Element = null;
        result = (<a href="about:blank" data-churchid={church.id} data-appname={appName} onClick={handleEditAccess} style={{ marginRight: 40 }} ><i className="fas fa-key"></i> {appName}</a>);
        return result;
    }


    const handleEditAccess = async (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var churchId = anchor.getAttribute('data-churchid');
        var appName = anchor.getAttribute('data-appname');

        var churchLoaded = false;
        UserHelper.churches.forEach(c => { if (c.id === churchId) churchLoaded = true });
        if (!churchLoaded) {
            const church = await ApiHelper.get('/churches/' + churchId + "?include=permissions", "AccessApi");
            UserHelper.churches.push(church);
        }
        const keyName = window.location.hostname.split(".")[0];
        UserHelper.selectChurch(context, churchId, keyName).then(() => {
            setRedirectUrl("/access/" + appName);
        });

    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

    const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); loadData(); } }

    React.useEffect(loadData, []);

    if (redirectUrl !== '') return <Redirect to={redirectUrl}></Redirect>;
    else return (
        <>
            <Row style={{ marginBottom: 25 }}>
                <div className="col"><h1 style={{ borderBottom: 0, marginBottom: 0 }}><i className="fas fa-key"></i> Your Access</h1></div>
            </Row>
            <Row>
                <Col md={8}>
                    <DisplayBox headerIcon="fas fa-key" headerText="Your access">
                        <InputGroup>
                            <FormControl id="searchText" data-cy="search-input" name="searchText" type="text" placeholder="Church Name" value={searchText} onChange={handleChange} onKeyDown={handleKeyDown} />
                            <InputGroup.Append><Button id="searchButton" data-cy="search-button" variant="primary" onClick={loadData}>Search</Button></InputGroup.Append>
                        </InputGroup>
                        <br />
                        {
                            churches.length === 0 ? <>No church found.  Please search for a different name.</> : (
                                <table className="table table-sm" id="adminChurchesTable">
                                    <thead>
                                        <tr>
                                            <th>Church</th>
                                            <th>Apps</th>
                                        </tr>
                                        {getChurchRows()}
                                    </thead>
                                </table>
                            )
                        }                       
                    </DisplayBox>
                </Col>
                <Col md={4}>

                </Col>
            </Row>
        </>
    );

}
