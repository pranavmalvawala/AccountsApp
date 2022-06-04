import React from "react";
import { UserHelper } from ".";
import { Person as PersonIcon, Church as ChurchIcon, Apps as AppsIcon, AdminPanelSettings, Logout as LogoutIcon } from '@mui/icons-material';
import { Divider, IconButton, List, ListSubheader, Typography } from "@mui/material";
import { Permissions } from "./"
import { SiteWrapper, NavItem } from "../appBase/components/material";


interface Props {
  pageTitle: string
}


export const Wrapper: React.FC<Props> = props => {

  const churchId = UserHelper.currentChurch.id
  const tabs = []
  tabs.push(<ListSubheader component="div">{UserHelper.currentChurch?.name || "Church"}</ListSubheader>);
  tabs.push(<NavItem url="/" label="Apps" icon={<AppsIcon />} />);

  if (UserHelper.checkAccess(Permissions.accessApi.settings.edit) && UserHelper.currentChurch !== null) {
    tabs.push(<NavItem url={`/${churchId}/manage`} label="Church Settings" icon={<ChurchIcon />} />);
  }


  if (UserHelper.checkAccess(Permissions.accessApi.server.admin)) tabs.push(<NavItem url="/admin" label="Admin" icon={<AdminPanelSettings />} />);
  tabs.push(<Divider />);
  tabs.push(<ListSubheader component="div">User</ListSubheader>);
  tabs.push(<NavItem url="/profile" label="Profile" icon={<PersonIcon />} />);
  tabs.push(<NavItem url="/logout" label="Logout" icon={<LogoutIcon />} />);

  const navContent = <List component="nav">{tabs}</List>
  const userMenu = <IconButton color="inherit"><PersonIcon /><Typography color="inherit" noWrap>Jeremy Zongker</Typography></IconButton>

  return <SiteWrapper logoUrl="/images/logo.png" navContent={navContent} pageTitle={props.pageTitle} userMenu={userMenu}>

  </SiteWrapper>

};
