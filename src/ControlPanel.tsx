import React from "react";
import UserContext from "./UserContext";

import { ApiHelper } from "./components";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./Login";

import { Authenticated } from "./Authenticated";
import { Logout } from "./Logout";

export const ControlPanel = () => {
  console.log("CP");
  let user = React.useContext(UserContext).userName; //to force rerender on login
  if (user === null) return null;
  console.log("CP ROUTES")

  return (
    <Routes>
      <Route path="/logout" element={<Logout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate replace to="/login" />}></Route>
      {getAuth()}
    </Routes>
  );
};

const getAuth = () => {
  if (ApiHelper.isAuthenticated) return <Route path="/*" element={<Authenticated />}></Route>
  else {
    return <Route path="/" element={<Navigate replace to="/login" />}></Route>
  }
}
