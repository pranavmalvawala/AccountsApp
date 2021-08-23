import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Header } from "./components";
import { ProfilePage } from "./profile/ProfilePage";
import { RolePage } from "./churches/RolePage";
import { AddChurchPage } from "./churches/AddChurchPage";
import { ChurchesPage } from "./churches/ChurchesPage";
import { ManageChurch } from "./churches/ManageChurch";
import { ChurchPage } from "./churches/ChurchPage";
import { AdminPage } from "./admin/AdminPage";
import UserContext from "./UserContext";

interface Props {
  location: any;
}

export const Authenticated: React.FC<Props> = (props) => {
  //to force rerender on login
  let user = React.useContext(UserContext)?.userName;
  let church = React.useContext(UserContext)?.churchName;
  console.log(user);
  console.log(church);

  return (
    <>
      <Header></Header>
      <div className="container">
        <Switch>
          <Route path="/login"><Redirect to={props.location} /></Route>
          <Route path="/admin"><AdminPage /></Route>
          <Route path="/churches/add" component={AddChurchPage} />
          <Route path="/churches/:id/manage" component={ManageChurch} />
          <Route path="/churches/:id/role/:roleId" component={RolePage} />
          <Route path="/churches/:id" component={ChurchPage} />
          <Route path="/churches"><ChurchesPage /></Route>
          <Route path="/profile"><ProfilePage /></Route>
        </Switch>
      </div>
    </>
  );
};
