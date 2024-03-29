import React from "react";
import { Navigate, useLocation } from "react-router-dom"
import { ApiHelper } from "./components";
import UserContext from "./UserContext";
import { useCookies } from "react-cookie";
import { LoginPage } from "./appBase/pageComponents/LoginPage";
import ReactGA from "react-ga";
import { EnvironmentHelper } from "./helpers";
import { UserInterface, ChurchInterface } from "./helpers";

export const Login: React.FC = () => {
  const [cookies] = useCookies(["jwt"]);
  const location = useLocation();

  const context = React.useContext(UserContext);

  const trackChurchRegister = async (church: ChurchInterface) => {
    if (EnvironmentHelper.GoogleAnalyticsTag !== "") ReactGA.event({ category: "Church", action: "Register" });
  }

  const trackUserRegister = async (user: UserInterface) => {
    if (EnvironmentHelper.GoogleAnalyticsTag !== "") ReactGA.event({ category: "User", action: "Register" });
  }

  if (context.user === null || !ApiHelper.isAuthenticated) {
    let search = new URLSearchParams(window.location.search);
    let jwt = search.get("jwt") || cookies.jwt;
    let auth = search.get("auth");
    let keyName = search.get("keyName");
    let appName = search.get("appName") || "AccountsApp";
    if (!jwt) jwt = "";
    if (!auth) auth = "";
    if (!keyName) keyName = ""

    return (<LoginPage auth={auth} context={context} jwt={jwt} appName={appName} appUrl={window.location.href} churchRegisteredCallback={trackChurchRegister} userRegisteredCallback={trackUserRegister} keyName={keyName} />);
  } else {
    let search = new URLSearchParams(window.location.search);
    const returnUrl = search.get("returnUrl");

    // @ts-ignore
    let from = returnUrl || location.state?.from?.pathname || "/";
    console.log(from);

    return <Navigate to={from} replace />;
  }
};
