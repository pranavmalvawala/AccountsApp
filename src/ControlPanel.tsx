import React from "react";
import UserContext from "./UserContext";

import { ApiHelper } from "./components";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Login } from "./Login";

import { Authenticated } from "./Authenticated";
import { Logout } from "./Logout";

export const ControlPanel = () => {
  console.log("CP");
  let user = React.useContext(UserContext).user; //to force rerender on login
  if (user === null) console.log("User is null");
  console.log("CP ROUTES")

  return (
    <Routes>
      <Route path="/logout" element={<Logout />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <Authenticated />
          </RequireAuth>
        }
      />
    </Routes>
  );
};

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation()
  if (!ApiHelper.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
