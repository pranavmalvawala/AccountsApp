import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components";
import { ProfilePage } from "./profile/ProfilePage";
import { RolePage } from "./churches/RolePage";
import { ManageChurch } from "./churches/ManageChurch";
import { ChurchPage } from "./churches/ChurchPage";
import { AdminPage } from "./admin/AdminPage";
import UserContext from "./UserContext";

export const Authenticated: React.FC = () => {
  console.log("AUTHENTICATED")
  //to force rerender on login
  let user = React.useContext(UserContext)?.userName;
  let church = React.useContext(UserContext)?.churchName;
  console.log(user);
  console.log(church);

  return (
    <>
      <Header></Header>
      <div className="container">
        <Routes>
          <Route path="/login" element={<Navigate to={window.location} />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/:id" element={<ChurchPage />} />
          <Route path="/:id/manage" element={<ManageChurch />} />
          <Route path="/:id/role/:roleId" element={<RolePage />} />
        </Routes>
      </div>
    </>
  );
};
