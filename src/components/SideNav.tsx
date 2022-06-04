import React from "react";
import { UserHelper, NavItems } from "./";
import { Link, useNavigate } from "react-router-dom";
import { Col, Container } from "react-bootstrap";
import { Person as PersonIcon, Church as ChurchIcon, Apps as AppsIcon, AdminPanelSettings, ChevronLeft, Menu as MenuIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { AppBar, AppBarProps, Badge, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, styled, Toolbar, Typography } from "@mui/material";
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

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => { setOpen(!open); };

  const drawerWidth: number = 240;
  const CustomDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: theme.spacing(7),
          [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
          },
        }),
      },
    }),
  );

  interface CustomAppBarProps extends AppBarProps {
    open?: boolean;
  }

  const CustomAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<CustomAppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  const churchId = UserHelper.currentChurch.id
  const tabs = []
  tabs.push(getTab({ key: "Apps", url: "/", icon: "apps", label: "Apps" }));
  tabs.push(getTab({ key: "Profile", url: "/profile", icon: "person", label: "Manage Profile" }));
  tabs.push(getTab({ key: "Church", url: `/${churchId}`, icon: "church", label: "Church Settings" }))
  if (UserHelper.checkAccess(Permissions.accessApi.server.admin)) tabs.push(getTab({ key: "Admin", url: "/admin", icon: "admin", label: "Admin" }));

  return <>
    <CustomAppBar position="absolute" open={open}>
      <Toolbar sx={{ pr: '24px' }}>
        <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer} sx={{ marginRight: '36px', ...(open && { display: 'none' }) }} >
          <MenuIcon />
        </IconButton>
        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }} >
          Manage: Ironwood Christian Church
        </Typography>
        <IconButton color="inherit">
          <Badge badgeContent={"4"} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </CustomAppBar>

    <CustomDrawer variant="permanent" open={open}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1] }}>
        <IconButton onClick={toggleDrawer}><ChevronLeft /></IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        {tabs}
      </List>
    </CustomDrawer>
  </>
};
