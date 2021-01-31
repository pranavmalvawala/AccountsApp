import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Header } from "./components";
import { ProfilePage } from './profile/ProfilePage';
import { RolePage } from './churches/RolePage';
import { AppAccess } from './churches/AppAccess';
import { ChurchesPage } from './churches/ChurchesPage';
import { ChurchPage } from './churches/ChurchPage';
import { AdminPage } from './admin/AdminPage';
import UserContext from "./UserContext";


interface Props {
  location: any;
}

export const Authenticated: React.FC<Props> = (props) => {
  //to force rerender on login
  var user = React.useContext(UserContext)?.userName;
  var church = React.useContext(UserContext)?.churchName;
  console.log(user);
  console.log(church);

  return (
    <>
      <link rel="stylesheet" href="/css/cp.css" />
      <Header></Header>
      <div className="container">
        <Switch>
          <Route path="/login"><Redirect to={props.location} /></Route>
          <Route path="/admin"><AdminPage /></Route>
          <Route path="/churches/:id/:app/:roleId" component={RolePage} />
          <Route path="/churches/:id/:app" component={AppAccess} />
          <Route path="/churches/:id" component={ChurchPage} />
          <Route path="/churches"><ChurchesPage /></Route>
          <Route path="/profile"><ProfilePage /></Route>
        </Switch>
      </div>
      <iframe title="print" style={{ display: "none" }} src="about:blank" id="printFrame"></iframe>
      <script src="/js/cp.js"></script>
    </>
  );
};
