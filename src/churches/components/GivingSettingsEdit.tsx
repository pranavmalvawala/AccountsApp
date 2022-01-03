import React from "react";
import { ApiHelper } from ".";
import { Row, Col, FormGroup } from "react-bootstrap";
import { PaymentGatewaysInterface, UniqueIdHelper } from "../../helpers";

interface Props { churchId: string, saveTrigger: Date | null }

export const GivingSettingsEdit: React.FC<Props> = (props) => {
  const [gateway, setGateway] = React.useState<PaymentGatewaysInterface>(null);
  const [provider, setProvider] = React.useState("");
  const [publicKey, setPublicKey] = React.useState("");
  const [privateKey, setPrivateKey] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    switch (e.currentTarget.id) {
      case "provider": setProvider(e.currentTarget.value); break;
      case "publicKey": setPublicKey(e.currentTarget.value); break;
      case "privateKey": setPrivateKey(e.currentTarget.value); break;
    }
  }

  const getKeys = () => {
    if (provider === "") return null;
    else return (<>
      <Col xl={4}>
        <FormGroup>
          <label>Public Key</label>
          <input id="publicKey" type="text" className="form-control" value={publicKey} onChange={handleChange} />
        </FormGroup>
      </Col>
      <Col xl={4}>
        <FormGroup>
          <label>Secret Key</label>
          <input id="privateKey" type="text" className="form-control" value={privateKey} placeholder="********" onChange={handleChange} />
        </FormGroup>
      </Col>
    </>);
  }

  const save = () => {
    if (provider === "") {
      if (!UniqueIdHelper.isMissing(gateway?.id)) ApiHelper.delete("/gateways/" + gateway.id, "GivingApi");
    } else {
      const gw: PaymentGatewaysInterface = (gateway === null) ? { churchId: props.churchId } : gateway;
      if (privateKey !== "") {
        gw.provider = provider;
        gw.publicKey = publicKey;
        gw.privateKey = privateKey;
        ApiHelper.post("/gateways", [gw], "GivingApi");
      }
    }
  }

  const checkSave = () => {
    if (props.saveTrigger !== null) save()
  };

  const loadData = async () => {
    const gateways = await ApiHelper.get("/gateways", "GivingApi");
    if (gateways.length === 0) {
      setGateway(null);
      setProvider("");
      setPublicKey("");
    }
    else {
      setGateway(gateways[0]);
      setProvider(gateways[0].provider);
      setPublicKey(gateways[0].publicKey);
    }
    setPrivateKey("");
  }

  React.useEffect(() => { if (!UniqueIdHelper.isMissing(props.churchId)) loadData() }, [props.churchId]); //eslint-disable-line
  React.useEffect(checkSave, [props.saveTrigger]); //eslint-disable-line

  return (
    <>
      <div className="subHead">Giving</div>
      <Row>
        <Col xl={4}>
          <FormGroup>
            <label>Provider</label>
            <select id="provider" className="form-control" value={provider} onChange={handleChange}>
              <option value="">None</option>
              <option value="Stripe">Stripe</option>
            </select>
          </FormGroup>
        </Col>
        {getKeys()}
      </Row>

    </>
  );

}

