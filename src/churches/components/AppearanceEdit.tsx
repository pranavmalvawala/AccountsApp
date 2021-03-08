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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        const settings = [ ...currentSettings ]
        const keySetting = settings.filter(c => c.keyName === name);

        if (keySetting.length === 0) {
            settings.push({ keyName: name, value, public: 1 });
        } else {
            keySetting[0].value = value;
        }

        setCurrentSettings(settings);
    }

    const imageUpdated = (dataUrl: string) => {
        if (dataUrl !== null) {
            const settings = [ ...currentSettings ];
            const keySetting = settings.filter(s => s.keyName === "logoImage");

            if (keySetting.length === 0) {
                settings.push({ keyName: "logoImage", value: dataUrl, public: 1 });
            } else {
                keySetting[0].value = dataUrl;
            }

            setCurrentSettings(settings);
            setEditLogo(false);
        }
    }

    const getLogoEditor = () => {
        if (!editLogo) return null;
        else return <ImageEditor settings={currentSettings} updatedFunction={imageUpdated}></ImageEditor>
    }

    const getLogoLink = () => {
        const logoImage = ArrayHelper.getOne(currentSettings, "keyName", "logoImage")
        var logoImg = (currentSettings && logoImage !== null) ? <img src={logoImage.value} alt="logo" className="img-fluid" /> : "none";
        return <a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setEditLogo(true); }}>{logoImg}</a>
    }

    const handleSave = () => {  ApiHelper.post("/settings", currentSettings, "AccessApi").then(props.updatedFunction); }

    React.useEffect(() => { setCurrentSettings(props.settings); }, [props.settings]);

    return (
        <>
            {getLogoEditor()}
            <InputBox headerIcon="fas fa-palette" headerText="Appearance" saveFunction={handleSave} >
                <FormGroup>
                    <label>Logo</label><br />
                    {getLogoLink()}
                </FormGroup>

                <FormGroup>
                    <label>Home Page Url</label>
                    <input type="text" className="form-control" name="homePageUrl" value={(ArrayHelper.getOne(currentSettings, "keyName", "homePageUrl"))?.value} onChange={handleChange} />
                </FormGroup>
                <div className="section">Colors</div>
                <Row>
                    <Col>
                        <FormGroup>
                            <label>Primary</label>
                            <input type="color" className="form-control" name="primaryColor" value={(ArrayHelper.getOne(currentSettings, "keyName", "primaryColor"))?.value} onChange={handleChange} />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <label>Contrast</label>
                            <input type="color" className="form-control" name="contrastColor" value={(ArrayHelper.getOne(currentSettings, "keyName", "contrastColor"))?.value} onChange={handleChange} />
                        </FormGroup>
                    </Col>
                </Row>
            </InputBox>
        </>
    );
}
