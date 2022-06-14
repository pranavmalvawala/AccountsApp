import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserHelper } from "./components";
import { ProfilePage } from "./profile/ProfilePage";
import { RolePage } from "./churches/RolePage";
import { ManageChurch } from "./churches/ManageChurch";
import { ChurchPage } from "./churches/ChurchPage";
import { AdminPage } from "./admin/AdminPage";
import UserContext from "./UserContext";
import { ReportPage } from "./admin/ReportPage";
import { Box } from "@mui/material";
import { Wrapper } from "./components/Wrapper";

export const Authenticated: React.FC = () => {
  console.log("AUTHENTICATED")
  //to force rerender on login
  let user = React.useContext(UserContext)?.user;
  let church = React.useContext(UserContext)?.church;
  console.log(user);
  console.log(church);
  let defaultPath = "/profile";
  if (UserHelper.currentChurch) defaultPath = "/" + UserHelper.currentChurch.id;

  return (
    <>
      <Box sx={{ display: "flex", backgroundColor: "#EEE" }}>
        <Wrapper>
          <Routes>
            <Route path="/admin/report/:keyName" element={<ReportPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<Navigate to={defaultPath} />} />
            <Route path="/:id" element={<ChurchPage />} />
            <Route path="/:id/manage" element={<ManageChurch />} />
            <Route path="/:id/role/:roleId" element={<RolePage />} />
            <Route path="/" element={<Navigate to={defaultPath} />} />
          </Routes>
        </Wrapper>
      </Box>
    </>
  );
};
