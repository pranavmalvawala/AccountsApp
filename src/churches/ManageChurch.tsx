import React, { useState, useContext } from "react";
import { Row, Col } from "react-bootstrap"
import UserContext from "../UserContext";
import { ChurchInterface, ApiHelper, UserHelper, ChurchSettings, Permissions, Appearance, Roles, RoleEdit, BreadCrumb, BreadCrumbProps } from "./components"
import { Redirect } from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";

type TParams = { id?: string };

export const ManageChurch = ({ match }: RouteComponentProps<TParams>) => {
  const [church, setChurch] = useState<ChurchInterface>(null);
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("notset");
  const context = useContext(UserContext);

  const loadData = () => {
    const churchId = match.params.id;
    if (churchId !== UserHelper.currentChurch.id) UserHelper.selectChurch(context, churchId);
    if (!UserHelper.checkAccess(Permissions.accessApi.settings.edit)) setRedirectUrl("/" + church.id);
    ApiHelper.get("/churches/" + match.params.id + "?include=permissions", "AccessApi").then(data => setChurch(data));
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

  React.useEffect(loadData, [match.params.id]);

  const items: BreadCrumbProps[] = [
    { name: church?.name, to: `/${church?.id}` },
    { name: "Manage", to: `/${church?.id}/manage`, active: true }
  ]

  if (redirectUrl !== "") return <Redirect to={redirectUrl}></Redirect>;
  else return (
    <>
      <BreadCrumb items={items} />
      <Row style={{ marginBottom: 25 }}>
        <div className="col"><h1 style={{ borderBottom: 0, marginBottom: 0 }}><i className="fas fa-church"></i> Manage: {church?.name || ""}</h1></div>
      </Row>
      <Row>
        <Col lg={8}>
          <ChurchSettings church={church} updatedFunction={loadData} />
          <Roles selectRoleId={setSelectedRoleId} selectedRoleId={selectedRoleId} church={church} />
        </Col>
        <Col lg={4}>
          {getSidebar()}
        </Col>
      </Row>
    </>
  );
}
