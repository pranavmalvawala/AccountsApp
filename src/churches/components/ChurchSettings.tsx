import React from "react";
import { ChurchInterface, DisplayBox, UserHelper, ChurchSettingsEdit, Permissions } from "./";
import { Row, Col } from "react-bootstrap";
import { Paper, Typography } from "@mui/material";

interface Props { church: ChurchInterface, updatedFunction: () => void }

export const ChurchSettings: React.FC<Props> = (props) => {

  const [mode, setMode] = React.useState("display");

  const handleEdit = () => setMode("edit");

  const handleUpdate = () => {
    setMode("display");
    props.updatedFunction();
  }

  const getEditFunction = () => (UserHelper.checkAccess(Permissions.accessApi.settings.edit)) ? handleEdit : null

  const getDisplayAddress = () => {
    let result: JSX.Element[] = [];
    if (props.church !== null) {

      if (!isEmpty(props.church.address1)) result.push(<span key="address1">{props.church.address1}<br /></span>);
      if (!isEmpty(props.church.address2)) result.push(<span key="address2">{props.church.address2}<br /></span>);
      if (!isEmpty(props.church.city)) result.push(<span key="state">{props.church.city}, {props.church.state} {props.church.zip}<br /></span>);
      if (!isEmpty(props.church.country)) result.push(<span key="country">{props.church.country}</span>);
    }
    return (<>{result}</>);
  }

  const isEmpty = (value: any) => value === undefined || value === null || value === ""

  if (mode === "display") {
    return (
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', marginBottom: 2 }} >
        <Typography component="h2" variant="h6" color="primary" gutterBottom>Church Settings</Typography>


        <Row>
          <Col>
            <label>Name</label><br />
            {props.church?.name}<br /><br />
          </Col>
          <Col>
            <label>Subdomain</label><br />
            {props.church?.subDomain}
          </Col>
        </Row>
        <label>Address</label><br />
        {getDisplayAddress()}<br /><br />
      </Paper>
    );
  } else return <ChurchSettingsEdit church={props.church} updatedFunction={handleUpdate} />
}

