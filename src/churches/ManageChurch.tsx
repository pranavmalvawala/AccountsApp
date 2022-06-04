import React, { useState, useContext } from "react";
import UserContext from "../UserContext";
import { ChurchInterface, ApiHelper, UserHelper, ChurchSettings, Permissions, Appearance, Roles, RoleEdit } from "./components"
import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Grid, Box } from "@mui/material";
import { Wrapper } from "../components/Wrapper";

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
    let modules: JSX.Element[] = [<Box sx={{ marginBottom: 2 }}><Appearance key="appearence" /></Box>];
    if (selectedRoleId !== "notset") {
      modules.splice(1, 0, <RoleEdit key="roleEdit" roleId={selectedRoleId} updatedFunction={() => { setSelectedRoleId("notset") }} />);
    }
    return modules;
  }

  React.useEffect(loadData, [params.id]); //eslint-disable-line

  if (redirectUrl !== "") return <Navigate to={redirectUrl}></Navigate>;
  else return (
    <Wrapper pageTitle={"Manage: " + church?.name}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <ChurchSettings church={church} updatedFunction={loadData} />
          <Roles selectRoleId={setSelectedRoleId} selectedRoleId={selectedRoleId} church={church} />
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          {getSidebar()}
        </Grid>
      </Grid>
    </Wrapper>
  );
}

