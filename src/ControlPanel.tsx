import React from "react";
import UserContext from "./UserContext";

import { ApiHelper } from "./components";
import { Switch, Route, Redirect } from "react-router-dom";
import { Login } from "./Login";

import { Authenticated } from "./Authenticated";
import { Logout } from "./Logout";

interface Props {
  path?: string;
}

export const ControlPanel = () => {
  let user = React.useContext(UserContext).userName; //to force rerender on login
  if (user === null) return null;
  return (
    <Switch>
      <Route path="/logout"><Logout /></Route>
      <Route path="/login" component={Login}></Route>
      <PrivateRoute path="/"></PrivateRoute>
    </Switch>
  );
};

const PrivateRoute: React.FC<Props> = ({ path }) => (
  <Route
    path={path}
    render={({ location }) => ApiHelper.isAuthenticated ? (<Authenticated location={location.pathname} />) : (<Redirect to={{ pathname: "/login", state: { from: location } }} />)}
  ></Route>
);
