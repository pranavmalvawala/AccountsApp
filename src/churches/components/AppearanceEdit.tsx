import React from "react";
import { Row, Col, FormGroup } from "react-bootstrap"
import { InputBox, ApiHelper, SettingInterface, EnvironmentHelper, ImageEditor } from "."

interface Props {
    updatedFunction?: () => void,
    settings?: SettingInterface
}

export const AppearanceEdit: React.FC<Props> = (props) => {
    const [currentSettings, setCurrentSettings] = React.useState<SettingInterface>();
    const [editLogo, setEditLogo] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        var s = { ...currentSettings };
        switch (e.currentTarget.name) {
            case "homePage": s.homePageUrl = val; break;
            case "primary": s.primaryColor = val; break;
            case "contrast": s.contrastColor = val; break;
        }
        setCurrentSettings(s);
    }

    const imageUpdated = (dataUrl: string) => {
        if (dataUrl !== null) {
            var s = { ...currentSettings };
            s.logoUrl = dataUrl;
            setCurrentSettings(s);
            setEditLogo(false);
        }
    }

    const getLogoEditor = () => {
        if (!editLogo) return null;
        else return <ImageEditor settings={currentSettings} updatedFunction={imageUpdated}></ImageEditor>
    }

    const getLogoUrl = (logoUrl: string) => {
        if (logoUrl.indexOf("/data/") === 0) return EnvironmentHelper.ContentRoot + currentSettings.logoUrl.replace("/data/", "");
        else return logoUrl;
    }
    const getLogoLink = () => {
        var logoImg = (currentSettings && currentSettings?.logoUrl !== "") ? <img src={getLogoUrl(currentSettings.logoUrl)} alt="logo" className="img-fluid" /> : "none";
        return <a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setEditLogo(true); }}>{logoImg}</a>
    }

    const handleSave = () => { ApiHelper.post("/settings", [currentSettings], "StreamingLiveApi").then(props.updatedFunction); }

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
                    <input type="text" className="form-control" name="homePage" value={currentSettings?.homePageUrl} onChange={handleChange} />
                </FormGroup>
                <div className="section">Colors</div>
                <Row>
                    <Col>
                        <FormGroup>
                            <label>Primary</label>
                            <input type="color" className="form-control" name="primary" value={currentSettings?.primaryColor} onChange={handleChange} />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <label>Contrast</label>
                            <input type="color" className="form-control" name="contrast" value={currentSettings?.contrastColor} onChange={handleChange} />
                        </FormGroup>
                    </Col>
                </Row>
            </InputBox>
        </>
    );
}
