import React from "react";
import { UserHelper } from ".";
import { List } from "@mui/material";
import { Permissions } from "./"
import { SiteWrapper, NavItem } from "../appBase/components";
import UserContext from "../UserContext";

interface Props { children: React.ReactNode }

export const Wrapper: React.FC<Props> = props => {
  const context = React.useContext(UserContext);
  const churchId = UserHelper.currentChurch.id;
  const tabs = [];

  tabs.push(<NavItem url="/" label="Apps" icon="apps" />);
  if (UserHelper.checkAccess(Permissions.accessApi.settings.edit) && UserHelper.currentChurch !== null) {
    tabs.push(<NavItem url={`/${churchId}/manage`} label="Church Settings" icon="church" />);
  }
  if (UserHelper.checkAccess(Permissions.accessApi.server.admin)) tabs.push(<NavItem url="/admin" label="Server Admin" icon="admin_panel_settings" />);
  const navContent = <List component="nav">{tabs}</List>

  return <SiteWrapper navContent={navContent} context={context}>{props.children}</SiteWrapper>

};
