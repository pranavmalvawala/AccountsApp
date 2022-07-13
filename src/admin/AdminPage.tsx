import React from "react";
import { ChurchInterface, ApiHelper, DisplayBox, UserHelper, DateHelper, ArrayHelper } from "./components";
import { Link, Navigate } from "react-router-dom";
import { Grid, TextField, Button, Icon } from "@mui/material";

export const AdminPage = () => {
  const [searchText, setSearchText] = React.useState<string>("")
  const [churches, setChurches] = React.useState<ChurchInterface[]>([]);
  const [redirectUrl, setRedirectUrl] = React.useState<string>("");

  const loadData = () => {
    const term = escape(searchText.trim());
    ApiHelper.get("/churches/all?term=" + term, "AccessApi").then(data => setChurches(data));
  }

  const handleArchive = (church: ChurchInterface) => {
    const tmpChurches = [...churches];
    const c = ArrayHelper.getOne(tmpChurches, "id", church.id)
    if (c.archivedDate) c.archivedDate = null;
    else c.archivedDate = new Date();

    ApiHelper.post("/churches/" + church.id + "/archive", { archived: c.archivedDate !== null }, "AccessApi");

    setChurches(tmpChurches);
  }

  const getChurchRows = () => {
    console.log("getChurchRows")
    if (churches === null) return;
    const result: JSX.Element[] = [];
    churches.forEach((c, index) => {

      const currentChurch = c;
      let activeLink = (c.archivedDate)
        ? <a href="about:blank" className="text-danger" onClick={(e) => { e.preventDefault(); handleArchive(currentChurch); }}>Archived</a>
        : <a href="about:blank" className="text-success" onClick={(e) => { e.preventDefault(); handleArchive(currentChurch); }}>Active</a>

      result.push(<tr key={index}>
        <td>{getManageAccessLink(c)}</td>
        <td>{DateHelper.prettyDate(DateHelper.convertToDate(c.registrationDate))}</td>
        <td>{activeLink}</td>
      </tr>);
    });
    result.unshift(<tr><th>Church</th><th>Registered</th><th>Active</th></tr>)
    return result;

  }

  const getManageAccessLink = (church: ChurchInterface) => {
    let result: JSX.Element = null;
    result = (<a href="about:blank" data-churchid={church.id} onClick={handleEditAccess} style={{ marginRight: 40 }}>{church.name}</a>);
    return result;
  }

  const handleEditAccess = async (e: React.MouseEvent) => {
    e.preventDefault();
    let anchor = e.currentTarget as HTMLAnchorElement;
    let churchId = anchor.getAttribute("data-churchid");

    //let churchLoaded = false;
    //UserHelper.churches.forEach(c => { if (c.id === churchId) churchLoaded = true });
    //if (!churchLoaded) {

    const result = await ApiHelper.get("/churches/" + churchId + "/impersonate", "AccessApi");
    console.log(result);

    const idx = ArrayHelper.getIndex(UserHelper.churches, "id", churchId);
    if (idx > -1) UserHelper.churches.splice(idx, 1);

    UserHelper.churches.push(...result.churches);
    //UserHelper.currentChurch = result.churches[0];
    //console.log(UserHelper.currentChurch);
    //UserHelper.setupApiHelper(UserHelper.currentChurch);
    //}
    setRedirectUrl(`/${churchId}/manage`);

  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); loadData(); } }

  React.useEffect(loadData, []); //eslint-disable-line

  if (redirectUrl !== "") return <Navigate to={redirectUrl}></Navigate>;
  else return (
    <>
      <h1><Icon>admin_panel_settings</Icon> Server Admin</h1>
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <DisplayBox headerIcon="church" headerText="Churches">
            <TextField fullWidth variant="outlined" name="searchText" label="Church Name" value={searchText} onChange={handleChange} onKeyDown={handleKeyDown}
              InputProps={{ endAdornment: <Button variant="contained" id="searchButton" data-cy="search-button" disableElevation onClick={loadData}>Search</Button> }}
            />
            <br />
            {
              churches.length === 0
                ? <>No church found.  Please search for a different name.</>
                : (
                  <table className="table table-sm" id="adminChurchesTable">
                    {getChurchRows()}
                  </table>
                )
            }
          </DisplayBox>
        </Grid>
        <Grid item md={4} xs={12}>
          <DisplayBox headerIcon="summarize" headerText="Reports">
            <ul>
              <li><Link to="/admin/report/activeChurches">Active Churches</Link></li>
            </ul>
          </DisplayBox>
        </Grid>
      </Grid>
    </>
  );

}
