import React from "react";
import { Row, Col, FormGroup } from "react-bootstrap"
import { ApiHelper, SettingInterface, AppearanceEdit, DisplayBox, EnvironmentHelper } from "."

interface Props { updatedFunction?: () => void, enableEdit?: boolean }

export const Appearance: React.FC<Props> = (props) => {
    const [currentSettings, setCurrentSettings] = React.useState<SettingInterface>();
    const [mode, setMode] = React.useState("display");

    const loadData = () => { ApiHelper.get("/settings", "AccessApi").then(data => setCurrentSettings(data[0])) }
    const handleEdit = () => { setMode("edit"); }
    const handleUpdate = () => { setMode("display"); loadData(); props.updatedFunction(); }

    const getLogoLink = () => {
        var logo = (currentSettings?.logoUrl || "");
        if (logo.indexOf("http") === -1) logo = EnvironmentHelper.ContentRoot + logo;

        var logoImg = (currentSettings && currentSettings?.logoUrl !== "") ? <img src={logo} alt="logo" className="img-fluid" /> : "No Logo";
        return <a href={currentSettings?.homePageUrl} target="_blank" rel="noopener noreferrer" >{logoImg}</a>
    }

    React.useEffect(() => { loadData(); }, []);
    let opts = {}
    if (props.enableEdit) {
        opts = {
            editFunction: handleEdit
        }
    }


    if (mode === "edit") return (<AppearanceEdit settings={currentSettings} updatedFunction={handleUpdate} />)
    else return (
        <DisplayBox headerIcon="fas fa-palette" headerText="Church Appearance" {...opts} >
            {getLogoLink()}
            <div className="section">Colors</div>
            <Row>
                <Col>
                    <FormGroup>
                        <label>Primary</label>
                        <input type="color" className="form-control" name="primary" value={currentSettings?.primaryColor || ""} disabled={true} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <label>Contrast</label>
                        <input type="color" className="form-control" name="contrast" value={currentSettings?.contrastColor || ""} disabled={true} />
                    </FormGroup>
                </Col>
            </Row>
        </DisplayBox>
    );
}
