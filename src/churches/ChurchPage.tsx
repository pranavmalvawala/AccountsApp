import React from "react";
import { Row, Col, Button } from "react-bootstrap"
import UserContext from "../UserContext";
import { DisplayBox, ChurchInterface, ApiHelper, UserHelper, Permissions, EnvironmentHelper } from "./components"
import { Navigate, useParams } from "react-router-dom";
import { Wrapper } from "../components/Wrapper";
import { Container } from "@mui/material";

export const ChurchPage = () => {
  console.log("CHURCH PAGE")
  const params = useParams();
  const [redirect, setRedirect] = React.useState("");
  const [church, setChurch] = React.useState<ChurchInterface>(null);
  const context = React.useContext(UserContext);
  const APPS: { app: string, url: string, logo?: string, desc?: string }[] = [
    { app: "CHUMS", url: createLoginLink(EnvironmentHelper.ChumsUrl), logo: "https://chums.org/images/logo.png", desc: "A completely free, open-source church management platform.  Keep track of visitors, attendance, giving, and more." },
    { app: "B1", url: createLoginLink(EnvironmentHelper.B1Url.replace("{key}", UserHelper.currentChurch.subDomain)), logo: "https://b1.church/images/logo-nav.png", desc: "A mobile app and website that helps churches connect with their members." },
    { app: "Lessons.church", url: createLoginLink(EnvironmentHelper.LessonsUrl), logo: "https://lessons.church/images/logo.png", desc: "Completely free curriculum for churches.  Schedule your lessons and easily present them on screens with the Lessons.church app" },
    { app: "StreamingLive", url: createLoginLink(EnvironmentHelper.StreamingLiveUrl.replace("{key}", UserHelper.currentChurch.subDomain)), logo: "https://streaminglive.church/images/logo.png", desc: "A live stream wrapper for your church.  Surrround YouTube, Vimeo, Facebook and other videos with live chat, donations, sermon notes, private prayer requests and more." }
  ]

  const loadData = () => {
    const churchId = params.id;
    if (churchId !== UserHelper.currentChurch.id) UserHelper.selectChurch(context, churchId);

    ApiHelper.get("/churches/" + params.id + "?include=permissions", "AccessApi").then(data => setChurch(data));
  }

  function createLoginLink(url: string) {
    const jwt = ApiHelper.getConfig("AccessApi").jwt
    const church = UserHelper.currentChurch
    return url + `/login?jwt=${jwt}&churchId=${church.id.toString()}`
  }

  const getSidebar = () => {
    if (!UserHelper.checkAccess(Permissions.accessApi.settings.edit) || church === null) return null;
    else return (<Button variant="primary" block size="lg" onClick={() => setRedirect(`/${church?.id}/manage`)}>Edit Church Settings</Button>);
  }

  React.useEffect(loadData, [params.id]); //eslint-disable-line

  if (redirect) return <Navigate to={redirect} />
  else return (
    <Wrapper pageTitle={church?.name || "Select App"} >
      <DisplayBox headerIcon="fas fa-link" headerText="Go to App">
        {
          APPS.map(a => (
            <a href={a.url} className="appLink" key={a.app}>
              <Row>
                <Col sm={4}><img src={a.logo} className="img-fluid" alt={a.app} /></Col>
                <Col sm={8}>{a.desc}</Col>
              </Row>
            </a>
          ))
        }
      </DisplayBox>
    </Wrapper>
  );
}
