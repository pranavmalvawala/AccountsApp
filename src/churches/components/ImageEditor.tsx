import React, { useCallback } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from "react-bootstrap";
import { InputBox, SettingInterface } from ".";


interface Props {
    settings: SettingInterface,
    updatedFunction: (dataUrl: string) => void
}

export const ImageEditor: React.FC<Props> = (props) => {
    //const [originalUrl, setOriginalUrl] = React.useState("about:blank");
    const [currentUrl, setCurrentUrl] = React.useState("about:blank");
    const [dataUrl, setDataUrl] = React.useState(null);
    var timeout: any = null;

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        let files;
        if (e.target) files = e.target.files;
        const reader = new FileReader();
        reader.onload = () => {
            var url = reader.result.toString();
            setCurrentUrl(url);
            setDataUrl(url);
        };
        reader.readAsDataURL(files[0]);
    }

    const getHeaderButton = () => {
        return (<div>
            <input type="file" onChange={handleUpload} id="fileUpload" accept="image/*" style={{ display: "none" }} />
            <Button size="sm" variant="info" onClick={(e: React.MouseEvent) => { e.preventDefault(); document.getElementById("fileUpload").click(); }} >Upload</Button>
        </div>);
    }

    const cropper = React.useRef(null);

    const onCropperInit = (c: any) => {
        cropper.current = c;
    }

    const cropCallback = () => {
        if (cropper.current !== null) {
            const data = cropper.current.getCropBoxData();
            const ratio = parseInt((150.0 / data.height).toString());
            const width = data.width * ratio;
            var url = cropper.current.getCroppedCanvas({ width: width, height: 150 }).toDataURL();
            setDataUrl(url);
        }
    }

    const handleCrop = () => {
        if (timeout !== null) {
            window.clearTimeout(timeout);
            timeout = null;
        }
        timeout = window.setTimeout(cropCallback, 200);
    }

    const handleSave = () => { props.updatedFunction(dataUrl); }
    const handleCancel = () => { props.updatedFunction(null); }
    const init = useCallback(() => {
        var startingUrl = props.settings.logoUrl;
        //setOriginalUrl(startingUrl);
        setCurrentUrl(startingUrl);
        // eslint-disable-next-line react-hooks/exhaustive-deps    
    }, []);

    React.useEffect(init, []);
    //aspectRatio={4 / 3}

    return (
        <InputBox id="cropperBox" headerIcon="" headerText="Crop" saveFunction={handleSave} saveText={"Update"} cancelFunction={handleCancel} headerActionContent={getHeaderButton()}  >
            <Cropper
                onInitialized={onCropperInit}
                src={currentUrl}
                style={{ height: 150, width: "100%" }}
                guides={false}
                crop={handleCrop} />
        </InputBox>
    );
}

