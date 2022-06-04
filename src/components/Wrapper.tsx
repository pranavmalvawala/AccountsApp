import React from "react";
import { UserHelper } from ".";
import { Person as PersonIcon, Church as ChurchIcon, Apps as AppsIcon, AdminPanelSettings, Logout as LogoutIcon } from "@mui/icons-material";
import { Box, Container, Divider, IconButton, List, ListSubheader, Typography } from "@mui/material";
import { Permissions } from "./"
import { SiteWrapper, NavItem } from "../appBase/components";

interface Props {
  pageTitle: string,
  children: React.ReactNode,
}

export const Wrapper: React.FC<Props> = props => {

  const churchId = UserHelper.currentChurch.id
  const tabs = []
  tabs.push(<ListSubheader component="div">{UserHelper.currentChurch?.name || "Church"}</ListSubheader>);
  tabs.push(<NavItem url="/" label="Apps" icon={<AppsIcon />} />);

  if (UserHelper.checkAccess(Permissions.accessApi.settings.edit) && UserHelper.currentChurch !== null) {
    tabs.push(<NavItem url={`/${churchId}/manage`} label="Church Settings" icon={<ChurchIcon />} />);
  }

  tabs.push(<Divider />);
  tabs.push(<ListSubheader component="div">User</ListSubheader>);
  if (UserHelper.checkAccess(Permissions.accessApi.server.admin)) tabs.push(<NavItem url="/admin" label="Server Admin" icon={<AdminPanelSettings />} />);
  tabs.push(<NavItem url="/profile" label="Profile" icon={<PersonIcon />} />);
  tabs.push(<NavItem url="/logout" label="Logout" icon={<LogoutIcon />} />);

  const navContent = <List component="nav">{tabs}</List>
  const userMenu = <IconButton color="inherit"><PersonIcon /><Typography color="inherit" noWrap>Jeremy Zongker</Typography></IconButton>

  return <>
    <SiteWrapper logoUrl="/images/logo.png" navContent={navContent} pageTitle={props.pageTitle} userMenu={userMenu}>

    </SiteWrapper>
    <Box component="main" sx={{ flexGrow: 1, overflow: "auto", marginTop: 8, minHeight: "90vh" }}>
      <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
        {props.children}
      </Container>
    </Box>
  </>

};
