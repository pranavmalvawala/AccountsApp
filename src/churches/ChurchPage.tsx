import React from "react";
import { Row, Col, Button } from "react-bootstrap"
import UserContext from "../UserContext";
import { DisplayBox, ChurchInterface, ApiHelper, UserHelper, Permissions, BreadCrumb, BreadCrumbProps, EnvironmentHelper } from "./components"
import { RouteComponentProps, useHistory } from "react-router-dom";

type TParams = { id?: string };

export const ChurchPage = ({ match }: RouteComponentProps<TParams>) => {
  const [church, setChurch] = React.useState<ChurchInterface>(null);
  const context = React.useContext(UserContext);
  const history = useHistory();
  const APPS: { app: string, url: string }[] = [
    { app: "AccountsManagement", url: "" },
    { app: "StreamingLive", url: createLoginLink(EnvironmentHelper.StreamingLiveUrl.replace("{key}", UserHelper.currentChurch.subDomain)) },
    { app: "CHUMS", url: createLoginLink(EnvironmentHelper.ChumsUrl) },
    { app: "B1", url: createLoginLink(EnvironmentHelper.B1Url.replace("{key}", UserHelper.currentChurch.subDomain)) },
    { app: "Lessons.church", url: createLoginLink(EnvironmentHelper.LessonsUrl) }
  ]

  const loadData = () => {
    const churchId = match.params.id;
    if (churchId !== UserHelper.currentChurch.id) UserHelper.selectChurch(context, churchId);

    ApiHelper.get("/churches/" + match.params.id + "?include=permissions", "AccessApi").then(data => setChurch(data));
  }

  function createLoginLink(url: string) {
    const jwt = ApiHelper.getConfig("AccessApi").jwt
    const church = UserHelper.currentChurch
    return url + `/login?jwt=${jwt}&churchId=${church.id.toString()}`
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
                {
                  APPS.map(a => (
                    <tr key={a.app}>
                      <td>{a.app}</td>
                      <td>{a.url && <a href={a.url} rel="external noopener noreferrer " target="_blank"><i className="fas fa-external-link-alt"></i></a>}</td>
                    </tr>
                  ))
                }
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
