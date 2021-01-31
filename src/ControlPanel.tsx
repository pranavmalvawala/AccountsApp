import React from "react";
import UserContext from "./UserContext";

import { ApiHelper } from "./components";
import { Switch, Route, Redirect } from "react-router-dom";
import { Forgot } from "./Forgot";
import { Login } from "./Login";

import { Authenticated } from "./Authenticated";
import { Logout } from "./Logout";

interface Props {
  path?: string;
}

export const ControlPanel = () => {
  var user = React.useContext(UserContext).userName; //to force rerender on login
  if (user === null) return null;
  return (
    <Switch>
      <Route path="/logout"><Logout /></Route>
      <Route path="/login" component={Login}></Route>
      <Route path="/forgot"><Forgot /></Route>
      <PrivateRoute path="/"></PrivateRoute>
    </Switch>
  );
};

const PrivateRoute: React.FC<Props> = ({ path }) => {
  return (
    <Route
      path={path}
      render={({ location }) => {
        return ApiHelper.isAuthenticated ? (<Authenticated location={location.pathname}></Authenticated>) :
          (<Redirect to={{ pathname: "/login", state: { from: location } }} ></Redirect>);
      }}
    ></Route>
  );
};
