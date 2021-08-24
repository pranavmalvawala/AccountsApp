import React from "react";
import { ApiHelper } from "./components";
import { Authenticated } from "./Authenticated";
import UserContext from "./UserContext";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { LoginPage } from "./appBase/pageComponents/LoginPage";

export const Login: React.FC = (props: any) => {
  const [cookies] = useCookies(["jwt"]);
  let { from } = (useLocation().state as any) || { from: { pathname: "/" } };

  const context = React.useContext(UserContext);

  if (context.userName === "" || !ApiHelper.isAuthenticated) {
    let search = new URLSearchParams(props.location.search);
    let jwt = search.get("jwt") || cookies.jwt;
    let auth = search.get("auth");
    if (!jwt) jwt = "";
    if (!auth) auth = "";

    return (<LoginPage auth={auth} context={context} jwt={jwt} appName="ChurchApps" />);
  } else {
    let path = from.pathname === "/" ? "/churches" : from.pathname;
    return <Authenticated location={path}></Authenticated>;
  }
};
