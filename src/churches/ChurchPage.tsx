import React from "react";
import { Row, Col, Button } from "react-bootstrap"
import UserContext from "../UserContext";
import { DisplayBox, ChurchInterface, ApiHelper, UserHelper, Permissions, BreadCrumb, BreadCrumbProps } from "./components"
import { RouteComponentProps, useHistory } from "react-router-dom";

type TParams = { id?: string };

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
    if (church !== null) {
      // TODO: return user's apps list. List will list all the apps in most cases.
    }
    return result;
  }

  // TODO: redirect urls for list of apps
  // const getLoginLink = (church: ChurchInterface, appName: string) => {
  //   const jwt = ApiHelper.getConfig("AccessApi").jwt;
  //   let result: JSX.Element = null;
  //   switch (appName) {
  //     case "CHUMS":
  //       result = (<a href={EnvironmentHelper.ChumsUrl + "/login/?jwt=" + jwt + "&churchId=" + church.id.toString()} rel="external noopener noreferrer " target="_blank"><i className="fas fa-external-link-alt"></i></a>);
  //       break;
  //     case "StreamingLive":
  //       result = (<a href={EnvironmentHelper.StreamingLiveUrl.replace("{key}", UserHelper.currentChurch.subDomain) + "/login/?jwt=" + jwt + "&churchId=" + church.id.toString()} rel="external noopener noreferrer" target="_blank"><i className="fas fa-external-link-alt"></i></a>);
  //       break;
  //   }
  //   return result;
  // }

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
