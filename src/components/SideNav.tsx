import React from "react";
import { UserHelper, NavItems } from "./";
import { Link, useNavigate } from "react-router-dom";
import { Col, Container } from "react-bootstrap";
import { Person as PersonIcon, Church as ChurchIcon, Apps as AppsIcon, AdminPanelSettings } from '@mui/icons-material';
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Permissions } from "../helpers/Permissions"

export const SideNav: React.FC = () => {

  interface Tab { key: string; url: string; icon: string; label: string; }

  const getTab = ({ key, url, icon, label }: Tab) => (
    <ListItemButton>
      <ListItemIcon>{getIcon(icon)}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );

  const getIcon = (icon: string) => {
    let result = <></>
    switch (icon) {
      case "church": result = <ChurchIcon />; break;
      case "person": result = <PersonIcon />; break;
      case "apps": result = <AppsIcon />; break;
      case "admin": result = <AdminPanelSettings />; break;
    }
    return result;
  }

  const churchId = UserHelper.currentChurch.id
  const tabs = []
  tabs.push(getTab({ key: "Apps", url: "/", icon: "apps", label: "Apps" }));
  tabs.push(getTab({ key: "Profile", url: "/profile", icon: "person", label: "Manage Profile" }));
  tabs.push(getTab({ key: "Church", url: `/${churchId}`, icon: "church", label: "Church Settings" }))
  if (UserHelper.checkAccess(Permissions.accessApi.server.admin)) tabs.push(getTab({ key: "Admin", url: "/admin", icon: "admin", label: "Admin" }));

  return <>
    <List component="nav">
      {tabs}
    </List>
  </>
};
