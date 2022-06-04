import React, { useState, useContext } from "react";
import { Row, Col } from "react-bootstrap"
import UserContext from "../UserContext";
import { ChurchInterface, ApiHelper, UserHelper, ChurchSettings, Permissions, Appearance, Roles, RoleEdit, BreadCrumb, BreadCrumbProps } from "./components"
import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Box, Container, CssBaseline, Divider, Drawer, Grid, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Paper, Toolbar } from "@mui/material";
import { SideNav } from "../components/SideNav";

export const ManageChurch = () => {
  const params = useParams();
  const [church, setChurch] = useState<ChurchInterface>(null);
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("notset");
  const context = useContext(UserContext);

  const loadData = () => {
    const churchId = params.id;
    if (churchId !== UserHelper.currentChurch.id) UserHelper.selectChurch(context, churchId);
    if (!UserHelper.checkAccess(Permissions.accessApi.settings.edit)) setRedirectUrl("/" + church.id);
    ApiHelper.get("/churches/" + params.id + "?include=permissions", "AccessApi").then(data => setChurch(data));
  }

  const getSidebar = () => {
    let modules: JSX.Element[] = [
      <Appearance key="appearence" />
    ];

    if (selectedRoleId !== "notset") {
      modules.splice(1, 0, <RoleEdit key="roleEdit" roleId={selectedRoleId} updatedFunction={() => { setSelectedRoleId("notset") }} />);
    }

    return modules;
  }

  React.useEffect(loadData, [params.id]); //eslint-disable-line

  //<h1 style={{ borderBottom: 0, marginBottom: 0 }}><i className="fas fa-church"></i> Manage: {church?.name || ""}</h1>

  if (redirectUrl !== "") return <Navigate to={redirectUrl}></Navigate>;
  else return (
    <>

      <SideNav />

      <Box component="main" sx={{ flexGrow: 1, overflow: 'auto', marginTop: 8 }}>
        <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>

              <ChurchSettings church={church} updatedFunction={loadData} />
              <Roles selectRoleId={setSelectedRoleId} selectedRoleId={selectedRoleId} church={church} />
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              {getSidebar()}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
function MuiDrawer(MuiDrawer: any, arg1: { shouldForwardProp: (prop: PropertyKey) => boolean; }) {
  throw new Error("Function not implemented.");
}

