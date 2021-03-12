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
        const ratio = logoName === "logoHeader" ? 4 : 1;
        if (!editLogo) return null;
        else return <ImageEditor settings={currentSettings} name={logoName} updatedFunction={(dataUrl) => imageUpdated(dataUrl, logoName)} aspectRatio={ratio} />
    }

    const getLogoLink = (name: string, backgroundColor: string) => {
        const logoImage = ArrayHelper.getOne(currentSettings, "keyName", name)
        var logoImg = (currentSettings && logoImage !== null) ? <img src={logoImage.value} alt="logo" className="img-fluid" style={{ backgroundColor: backgroundColor }} /> : "none";
        return <a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setEditLogo(true); setCurrentEditLogo(name) }}>{logoImg}</a>
    }

    const handleSave = () => { ApiHelper.post("/settings", currentSettings, "AccessApi").then(props.updatedFunction); }

    React.useEffect(() => { setCurrentSettings(props.settings); }, [props.settings]);

    return (
        <>
            {getLogoEditor(currentEditLogo)}
            <InputBox headerIcon="fas fa-palette" headerText="Church Appearance" saveFunction={handleSave} >
                <FormGroup>
                    <label>Navbar Logo</label><br />
                    {getLogoLink("logoHeader", ArrayHelper.getOne(currentSettings, "keyName", "primaryColor")?.value || "#08A0CC")}
                </FormGroup>
                <FormGroup>
                    <label>Login Screen Logo</label><br />
                    {getLogoLink("logoSquare", "#FFFFFF")}
                </FormGroup>
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
