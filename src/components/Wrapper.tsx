import React from "react";
import { Themes, UserHelper } from ".";
import { List } from "@mui/material";
import { Permissions } from "./"
import { SiteWrapper, NavItem } from "../appBase/components";
import UserContext from "../UserContext";

interface Props { children: React.ReactNode }

export const Wrapper: React.FC<Props> = props => {
  const context = React.useContext(UserContext);
  const churchId = UserHelper.currentChurch.id;
  const tabs = [];

  const getSelectedTab = () => {
    const path = window.location.pathname;
    let result = "";
    if (path.startsWith("/admin")) result = "admin";
    else if (path.indexOf("/manage") > -1) result = "settings";
    else result = "apps"
    return result;
  }

  const selectedTab = getSelectedTab();

  tabs.push(<NavItem url="/" label="Apps" icon="apps" selected={selectedTab === "apps"} />);
  if (UserHelper.checkAccess(Permissions.accessApi.settings.edit) && UserHelper.currentChurch !== null) tabs.push(<NavItem url={`/${churchId}/manage`} label="Church Settings" icon="church" selected={selectedTab === "settings"} />);
  if (UserHelper.checkAccess(Permissions.accessApi.server.admin)) tabs.push(<NavItem url="/admin" label="Server Admin" icon="admin_panel_settings" selected={selectedTab === "admin"} />);
  const navContent = <List component="nav" sx={Themes.NavBarStyle}>{tabs}</List>

  return <SiteWrapper navContent={navContent} context={context} appName="ChurchApps">{props.children}</SiteWrapper>

};
