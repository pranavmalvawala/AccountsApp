import React, { useState } from "react";
import { Row } from "react-bootstrap"
import { ApiHelper, AppearanceEdit, DisplayBox, GenericSettingInterface, IChurchAppearance } from "."

interface Props { }

export const Appearance: React.FC<Props> = (props) => {
    const [currentSettings, setCurrentSettings] = useState<GenericSettingInterface[]>([]);
    const [mode, setMode] = useState("display");
    const [styles, setStyles] = useState<IChurchAppearance>({});

    const loadData = () => { ApiHelper.get("/settings", "AccessApi").then(settings => { setCurrentSettings(settings); configureStyles(settings)}) }
    const handleEdit = () => { setMode("edit"); }
    const handleUpdate = () => { setMode("display"); loadData(); }

    const getLogoLink = () => {
        const logoSrc = styles?.logoImage;
        var logoImg = (styles && logoSrc !== null && logoSrc !== undefined) ? <img src={logoSrc} alt="logo" className="img-fluid" /> : null;
        return logoImg
    }

    const configureStyles = (settings: GenericSettingInterface[]) => {
        let style: any = {};
        settings.map(s => { style[s.keyName] = s.value; return null });
        setStyles(style);
    }

    React.useEffect(loadData, []);
    const allConfigs = Object.keys(styles)

    if (mode === "edit") return (<AppearanceEdit settings={currentSettings} updatedFunction={handleUpdate} />)
    else return (
        <DisplayBox headerIcon="fas fa-palette" headerText="Church Appearance" editFunction={handleEdit} >
            {
                allConfigs.length === 0 ? "Please set new configurations." : (
                    <>
                        <Row className="ml-0 mr-0 pl-2" style={{ backgroundColor: styles.primaryColor, color: styles.primaryContrast }}>
                            {getLogoLink()}
                            Primary Colors
                        </Row>
                        <Row className="ml-0 mr-0 pl-2" style={{ backgroundColor: styles.secondaryColor, color: styles.secondaryContrast }}>
                            Secondary Colors
                        </Row>
                    </>
                )
            }
            
        </DisplayBox>
    );
}
