import React, { useState } from "react";
import { Row, Col, FormGroup } from "react-bootstrap"
import { ApiHelper, AppearanceEdit, DisplayBox, GenericSettingInterface, ArrayHelper } from "."

interface Props { updatedFunction?: () => void, enableEdit?: boolean }

export const Appearance: React.FC<Props> = (props) => {
    const [currentSettings, setCurrentSettings] = useState<GenericSettingInterface[]>([]);
    const [mode, setMode] = React.useState("display");

    const loadData = () => { ApiHelper.get("/settings", "AccessApi").then(settings => setCurrentSettings(settings)) }
    const handleEdit = () => { setMode("edit"); }
    const handleUpdate = () => { setMode("display"); loadData(); props.updatedFunction(); }

    const getLogoLink = (keyName: string) => {
        var logo = (ArrayHelper.getOne(currentSettings, "keyName", keyName))?.value;

        var logoImg = (currentSettings && ArrayHelper.getOne(currentSettings, "keyName", "logoImage") !== null) ? <img src={logo} alt="logo" className="img-fluid" /> : "No Logo";
        return <a href={(ArrayHelper.getOne(currentSettings, "keyName", "homePageUrl"))?.value} target="_blank" rel="noopener noreferrer" >{logoImg}</a>
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
            <FormGroup>
                <label>Navbar Logo</label><br />
                {getLogoLink("logoImage")}
            </FormGroup>
            <FormGroup>
                <label>Login Screen Logo</label><br />
                {getLogoLink("loginLogo")}
            </FormGroup>
            <div className="section">Primary Colors</div>
            <Row>
                <Col>
                    <FormGroup>
                        <label>Color</label>
                        <input type="color" className="form-control" name="primaryColor" value={(ArrayHelper.getOne(currentSettings, "keyName", "primaryColor"))?.value} disabled={true} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <label>Contrast</label>
                        <input type="color" className="form-control" name="primaryContrast" value={(ArrayHelper.getOne(currentSettings, "keyName", "primaryContrast"))?.value} disabled={true} />
                    </FormGroup>
                </Col>
            </Row>
            <div className="section">Secondary Colors</div>
            <Row>
                <Col>
                    <FormGroup>
                        <label>Color</label>
                        <input type="color" className="form-control" name="secondaryColor" value={(ArrayHelper.getOne(currentSettings, "keyName", "secondaryColor"))?.value} disabled={true} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <label>Contrast</label>
                        <input type="color" className="form-control" name="secondaryContrast" value={(ArrayHelper.getOne(currentSettings, "keyName", "secondaryContrast"))?.value} disabled={true} />
                    </FormGroup>
                </Col>
            </Row>
        </DisplayBox>
    );
}
