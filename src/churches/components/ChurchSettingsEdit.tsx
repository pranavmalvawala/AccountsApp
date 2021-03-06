import React from "react";
import { ApiHelper, ChurchInterface, InputBox, ErrorMessages } from "./";
import { Row, Col, FormGroup } from "react-bootstrap";
import { GivingSettingsEdit } from "./GivingSettingsEdit";
import { UserHelper, Permissions } from "../../helpers";

interface Props { church: ChurchInterface, updatedFunction: () => void }

export const ChurchSettingsEdit: React.FC<Props> = (props) => {
  const [church, setChurch] = React.useState({} as ChurchInterface);
  const [errors, setErrors] = React.useState([]);
  const [saveTrigger, setSaveTrigger] = React.useState<Date | null>(null);

  const handleSave = async () => {
    if (validate()) {
      setSaveTrigger(new Date());
      const resp = await ApiHelper.post("/churches", [church], "AccessApi");
      if (resp.errors !== undefined) setErrors(resp.errors);
      else props.updatedFunction();
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const validate = () => {
    let errors = [];
    if (church.name === "") errors.push("Church name cannot be blank.");
    if (church.subDomain === "") errors.push("Sub domain cannot be blank.");
    setErrors(errors);
    return errors.length === 0;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let c = { ...church };
    switch (e.currentTarget.id) {
      case "churchName": c.name = e.currentTarget.value; break;
      case "address1": c.address1 = e.currentTarget.value; break;
      case "address2": c.address2 = e.currentTarget.value; break;
      case "city": c.city = e.currentTarget.value; break;
      case "state": c.state = e.currentTarget.value; break;
      case "zip": c.zip = e.currentTarget.value; break;
      case "country": c.country = e.currentTarget.value; break;
      case "subDomain": c.subDomain = e.currentTarget.value; break;
    }

    setChurch(c);
  }

  const giveSection = () => {
    if (!UserHelper.checkAccess(Permissions.givingApi.settings.edit)) return null;
    else return (<GivingSettingsEdit churchId={church?.id || ""} saveTrigger={saveTrigger} />)
  }

  React.useEffect(() => setChurch(props.church), [props.church]);

  if (church === null || church.id === undefined) return null;
  else return (
    <InputBox id="campusBox" cancelFunction={props.updatedFunction} saveFunction={handleSave} headerText={church.name} headerIcon="fas fa-church">
      <ErrorMessages errors={errors} />
      <Row>
        <Col>
          <FormGroup>
            <label>Church Name</label>
            <input id="churchName" type="text" className="form-control" value={church?.name || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <label>Subdomain</label>
            <input id="subDomain" type="text" className="form-control" value={church?.subDomain || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col>
          <FormGroup>
            <label>Address Line 1</label>
            <input id="address1" type="text" className="form-control" value={church?.address1 || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <label>Address Line 2</label>
            <input id="address2" type="text" className="form-control" value={church?.address2 || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col sm={6}>
          <FormGroup>
            <label>City</label>
            <input id="city" type="text" className="form-control" value={church?.city || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
          </FormGroup>
        </Col>
        <Col sm={3}>
          <FormGroup>
            <label>State</label>
            <input id="state" type="text" className="form-control" value={church?.state || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
          </FormGroup>
        </Col>
        <Col sm={3}>
          <FormGroup>
            <label>Zip</label>
            <input id="zip" type="text" className="form-control" value={church?.zip || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
          </FormGroup>
        </Col>
      </Row>
      <FormGroup>
        <label>Country</label>
        <input id="country" type="text" className="form-control" value={church?.country || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
      </FormGroup>
      {giveSection()}

    </InputBox>
  );

}

