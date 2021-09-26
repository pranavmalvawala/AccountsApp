import React from "react";
import { Row, Col, Button } from "react-bootstrap"
import UserContext from "../UserContext";
import { DisplayBox, ChurchInterface, ApiHelper, UserHelper, Permissions, BreadCrumb, BreadCrumbProps, EnvironmentHelper } from "./components"
import { RouteComponentProps, useHistory } from "react-router-dom";

type TParams = { id?: string };

const APP_TO_API_MAPPING: { [key: string]: string } = {
  AccessApi: "AccountsManagement",
  StreamingLiveApi: "StreamingLive",
  MessagingApi: "StreamingLive",
  GivingApi: "CHUMS",
  MembershipApi: "CHUMS",
  AttendanceApi: "CHUMS",
  B1Api: "B1",
  LessonsApi: "Lessons.church"
}

export const ChurchPage = ({ match }: RouteComponentProps<TParams>) => {
  const [church, setChurch] = React.useState<ChurchInterface>(null);
  const context = React.useContext(UserContext);
  const history = useHistory();

  const loadData = () => {
    const churchId = match.params.id;
    if (churchId !== UserHelper.currentChurch.id) UserHelper.selectChurch(context, churchId);

    ApiHelper.get("/churches/" + match.params.id + "?include=permissions", "AccessApi").then(data => setChurch(data));
  }

  const getAppRows = () => {
    const result: JSX.Element[] = [];
    const apps: string[] = [];

    if (church !== null) {
      ApiHelper.apiConfigs.forEach(api => {
        if (api.permisssions.length > 0) {
          const appName = APP_TO_API_MAPPING[api.keyName]
          if (!apps.includes(appName) ) {
            apps.push(appName)
            result.push(
              <tr key={appName}>
                <td>{appName}</td>
                <td>{getLoginLink(appName, api.jwt)}</td>
              </tr>
            )
          }
        }
      })
    }

    if (result.length === 0) {
      result.push(
        <tr key="0">
          <td>AccountsManagement</td>
          <td />
        </tr>)
    }

    return result;
  }

  const getLoginLink = (appName: string, jwt: string) => {
    const church = UserHelper.currentChurch
    let result: JSX.Element = null;
    switch (appName) {
      case "CHUMS":
        result = (<a href={EnvironmentHelper.ChumsUrl + "/login/?jwt=" + jwt + "&churchId=" + church.id.toString()} rel="external noopener noreferrer " target="_blank"><i className="fas fa-external-link-alt"></i></a>);
        break;
      case "StreamingLive":
        result = (<a href={EnvironmentHelper.StreamingLiveUrl.replace("{key}", UserHelper.currentChurch.subDomain) + "/login/?jwt=" + jwt + "&churchId=" + church.id.toString()} rel="external noopener noreferrer" target="_blank"><i className="fas fa-external-link-alt"></i></a>);
        break;
    }
    return result;
  }

  const getSidebar = () => {
    if (!UserHelper.checkAccess(Permissions.accessApi.settings.edit) || church === null) return null;
    else return (<Button variant="primary" size="lg" block onClick={() => history.push(`/${church?.id}/manage`)}>Edit Church Settings</Button>);
  }

  React.useEffect(loadData, [match.params.id]);

  const items: BreadCrumbProps[] = [
    { name: church?.name, to: `/${church?.id}`, active: true }
  ]

  return (
    <>
      <BreadCrumb items={items} />
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

        </Col>
        <Col md={4}>
          {getSidebar()}
        </Col>
      </Row>
    </>
  );
}
