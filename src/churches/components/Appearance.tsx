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

    const getLogoLink = () => {
        var logo = (ArrayHelper.getOne(currentSettings, "keyName", "logoImage"))?.value;

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
            {getLogoLink()}
            <div className="section">Colors</div>
            <Row>
                <Col>
                    <FormGroup>
                        <label>Primary</label>
                        <input type="color" className="form-control" name="primary" value={(ArrayHelper.getOne(currentSettings, "keyName", "primaryColor"))?.value} disabled={true} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <label>Contrast</label>
                        <input type="color" className="form-control" name="contrast" value={(ArrayHelper.getOne(currentSettings, "keyName", "contrastColor"))?.value} disabled={true} />
                    </FormGroup>
                </Col>
            </Row>
        </DisplayBox>
    );
}
