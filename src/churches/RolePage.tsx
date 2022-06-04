import React, { useState } from "react";
import { ApiHelper, RoleInterface, UserAdd, UserHelper, Permissions, RoleMemberInterface, BreadCrumb, BreadCrumbProps } from "./components";
import { useParams } from "react-router-dom"
import { RoleMembers } from "./components/RoleMembers";
import { RolePermissions } from "./components/RolePermissions";
import { Row, Col } from "react-bootstrap";
import { Wrapper } from "../components/Wrapper";
import { Grid } from "@mui/material";

export const RolePage = () => {
  const params = useParams();
  const [role, setRole] = React.useState<RoleInterface>({} as RoleInterface);
  const [showAdd, setShowAdd] = React.useState<boolean>(false);
  const [selectedRoleMemberId, setSelectedRoleMemberId] = React.useState<string>("");
  const [roleMembers, setRoleMembers] = useState<RoleMemberInterface[]>([]);
  const church = UserHelper.currentChurch;

  const handleShowAdd = (role: RoleInterface) => { setShowAdd(true); }
  const handleAdd = () => { setShowAdd(false); setSelectedRoleMemberId(""); loadData(); loadRoleMembers(); }

  const loadData = () => {
    if (params.roleId === "everyone") {
      setRole({ id: null, name: "Everyone" });
      return;
    }
    ApiHelper.get("/roles/" + params.roleId, "AccessApi")
      .then(data => setRole(data));
  }
  const loadRoleMembers = () => { ApiHelper.get("/rolemembers/roles/" + params.roleId + "?include=users", "AccessApi").then((data: any) => { setRoleMembers(data); }); }

  const getAddUser = () => {
    if (showAdd || selectedRoleMemberId) return <UserAdd role={role} roleMembers={roleMembers} selectedUser={selectedRoleMemberId} updatedFunction={handleAdd} />;
    return null;
  }

  const getSidebar = () => {
    if (!UserHelper.checkAccess(Permissions.accessApi.roles.edit)) return (null);
    else return (<>
      {getAddUser()}
      <RolePermissions role={role} />
    </>);
  }

  React.useEffect(loadData, []); //eslint-disable-line
  React.useEffect(loadRoleMembers, []); //eslint-disable-line

  const items: BreadCrumbProps[] = [
    { name: church?.name, to: `/${church?.id}` },
    { name: "Manage", to: `/${church?.id}/manage` },
    { name: role.name, to: `/${church?.id}/role/${role?.id}`, active: true }
  ]

  if (!UserHelper.checkAccess(Permissions.accessApi.roles.view)) return (<></>);
  else {
    return (
      <Wrapper pageTitle={"Edit Role: " + role?.name}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={9}>
            <RoleMembers
              role={role}
              roleMembers={roleMembers}
              addFunction={handleShowAdd}
              setSelectedRoleMember={setSelectedRoleMemberId}
              updatedFunction={handleAdd}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            {getSidebar()}
          </Grid>
        </Grid>
      </Wrapper>
    );
  }
}

