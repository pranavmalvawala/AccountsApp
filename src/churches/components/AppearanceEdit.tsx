import React from "react";
import { Row, Col, FormGroup } from "react-bootstrap"
import { InputBox, ApiHelper, ImageEditor, GenericSettingInterface, ArrayHelper } from "."

interface Props {
  updatedFunction?: () => void,
  settings?: GenericSettingInterface[],
}

export const AppearanceEdit: React.FC<Props> = (props) => {
  const [currentSettings, setCurrentSettings] = React.useState<GenericSettingInterface[]>([]);
  const [editLogo, setEditLogo] = React.useState(false);
  const [currentEditLogo, setCurrentEditLogo] = React.useState<string>("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    const settings = [...currentSettings]
    const keySetting = settings.filter(c => c.keyName === name);

    if (keySetting.length === 0) {
      settings.push({ keyName: name, value, public: 1 });
    } else {
      keySetting[0].value = value;
    }

    setCurrentSettings(settings);
  }

  const imageUpdated = (dataUrl: string, keyName: string) => {
    if (dataUrl !== null) {
      const settings = [...currentSettings];
      const keySetting = settings.filter(s => s.keyName === keyName);

      if (keySetting.length === 0) {
        settings.push({ keyName, value: dataUrl, public: 1 });
      } else {
        keySetting[0].value = dataUrl;
      }

      setCurrentSettings(settings);
    }
    setEditLogo(false);
  }

  const getLogoEditor = (logoName: string) => {
    if (!editLogo) return null;
    else return <ImageEditor settings={currentSettings} name={logoName} updatedFunction={(dataUrl) => imageUpdated(dataUrl, logoName)} aspectRatio={4} />
  }

  const getLogoLink = (name: string, backgroundColor: string) => {
    const logoImage = ArrayHelper.getOne(currentSettings, "keyName", name)
    let logoImg = (currentSettings && logoImage !== null) ? <img src={logoImage.value} alt="logo" className="img-fluid" style={{ backgroundColor: backgroundColor }} /> : "none";
    return <a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setEditLogo(true); setCurrentEditLogo(name) }}>{logoImg}</a>
  }

  const handleSave = () => { ApiHelper.post("/settings", currentSettings, "AccessApi").then(props.updatedFunction); }
  const handleCancel = () => { props.updatedFunction(); }

  React.useEffect(() => { setCurrentSettings(props.settings); }, [props.settings]);

  return (
    <>
      {getLogoEditor(currentEditLogo)}
      <InputBox headerIcon="fas fa-palette" headerText="Church Appearance" saveFunction={handleSave} cancelFunction={handleCancel}>
        <div style={{ backgroundColor: "#EEE", margin: -10, padding: 10 }}>
          <FormGroup>
            <label>Logo - Light background</label><br />
            <p style={{ color: "#999", fontSize: 12 }}>Upload horizontal logo with a transparent background suitable for use of light backrounds.</p>
            {getLogoLink("logoLight", "#EEE")}

          </FormGroup>
        </div>
        <hr />
        <div style={{ backgroundColor: "#333", margin: -10, padding: 10, color: "#FFF" }}>
          <FormGroup>
            <label>Logo - Dark background</label><br />
            <p style={{ color: "#999", fontSize: 12 }}>Upload horizontal logo with a transparent background suitable for use of dark backrounds.</p>
            {getLogoLink("logoDark", "#333")}
          </FormGroup>
        </div>
        <hr />
        <div className="section">Primary Colors</div>
        <Row>
          <Col>
            <FormGroup>
              <label>Color</label>
              <input type="color" className="form-control" name="primaryColor" value={(ArrayHelper.getOne(currentSettings, "keyName", "primaryColor"))?.value || "#08A0CC"} onChange={handleChange} />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <label>Contrast</label>
              <input type="color" className="form-control" name="primaryContrast" value={(ArrayHelper.getOne(currentSettings, "keyName", "primaryContrast"))?.value || "#FFFFFF"} onChange={handleChange} />
            </FormGroup>
          </Col>
        </Row>
        <div className="section">Secondary Colors</div>
        <Row>
          <Col>
            <FormGroup>
              <label>Color</label>
              <input type="color" className="form-control" name="secondaryColor" value={(ArrayHelper.getOne(currentSettings, "keyName", "secondaryColor"))?.value || "#FFBA1A"} onChange={handleChange} />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <label>Contrast</label>
              <input type="color" className="form-control" name="secondaryContrast" value={(ArrayHelper.getOne(currentSettings, "keyName", "secondaryContrast"))?.value || "#000000"} onChange={handleChange} />
            </FormGroup>
          </Col>
        </Row>
      </InputBox>
    </>
  );
}
