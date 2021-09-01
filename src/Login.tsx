import React from "react";
import { ApiHelper } from "./components";
import { Authenticated } from "./Authenticated";
import UserContext from "./UserContext";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { LoginPage } from "./appBase/pageComponents/LoginPage";
import ReactGA from "react-ga";
import { EnvironmentHelper, UserHelper } from "./helpers";
import { UserInterface, ChurchInterface } from "./helpers";

export const Login: React.FC = (props: any) => {
  const [cookies] = useCookies(["jwt"]);
  let { from } = (useLocation().state as any) || { from: { pathname: "/" } };

  const context = React.useContext(UserContext);

  const trackChurchRegister = async (church: ChurchInterface) => {
    if (EnvironmentHelper.GoogleAnalyticsTag !== "") ReactGA.event({ category: "Church", action: "Register" });
  }

  const trackUserRegister = async (user: UserInterface) => {
    if (EnvironmentHelper.GoogleAnalyticsTag !== "") ReactGA.event({ category: "User", action: "Register" });
  }

  if (context.userName === "" || !ApiHelper.isAuthenticated) {
    let search = new URLSearchParams(props.location.search);
    let jwt = search.get("jwt") || cookies.jwt;
    let auth = search.get("auth");
    if (!jwt) jwt = "";
    if (!auth) auth = "";

    return (<LoginPage auth={auth} context={context} jwt={jwt} appName="ChurchApps" appUrl={window.location.href} churchRegisteredCallback={trackChurchRegister} userRegisteredCallback={trackUserRegister} />);
  } else {
    const churchId = UserHelper.currentChurch.id;
    // in case when church is changed what you can do is just check current churchId and the churchId
    // from the path it wants to redirect to (from.pathName). If they don't match just redirect to /:churchId
    let path = from.pathname === "/" ? `/${churchId}` : from.pathname;
    return <Authenticated location={path}></Authenticated>;
  }
};
