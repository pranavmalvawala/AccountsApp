import React from 'react';
import { ApiHelper, ChurchInterface, DisplayBox, ChurchAppInterface, ApplicationInterface, UserHelper, LoginResponseInterface, ErrorMessages, Permissions } from './';

interface Props { church: ChurchInterface, redirectFunction: (url: string) => void, updatedFunction: () => void }

export const ChurchApps: React.FC<Props> = (props) => {

    const [apps, setApps] = React.useState<ApplicationInterface[]>(null);
    const [churchApps, setChurchApps] = React.useState<ChurchAppInterface[]>(null);
    const [errors, setErrors] = React.useState<string[]>([]);

    const handleActivate = async (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        anchor.style.visibility = 'none';
        var churchId = parseInt(anchor.getAttribute('data-churchid'), 0);
        var appName = anchor.getAttribute('data-appname');
        activate(churchId, appName);
    }

    const activate = async (churchId: number, appName: string) => {
        var resp: LoginResponseInterface = await ApiHelper.post("/churchApps/register", { appName: appName }, "AccessApi");
        if (resp.errors !== undefined) { setErrors(resp.errors); }
        props.updatedFunction();
    }

    const handleEditAccess = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var churchId = anchor.getAttribute('data-churchid');
        var appName = anchor.getAttribute('data-appname');
        props.redirectFunction("/churches/" + churchId.toString() + "/" + appName)
    }

    const getManageAccessLink = (appName: string) => {
        var result: JSX.Element = null;
        if (UserHelper.checkAccess(Permissions.accessApi.roles.edit)) result = (<a href="about:blank" data-churchid={props.church.id} data-appname={appName} onClick={handleEditAccess} ><i className="fas fa-key"></i></a>);
        return result;
    }

    const loadData = () => {
        if (props.church !== null) {
            ApiHelper.get('/applications/', "AccessApi").then(data => setApps(data));
            ApiHelper.get('/churchApps/', "AccessApi").then(data => setChurchApps(data));
        }
    }

    const getApps = () => {
        if (apps === null) return null;
        const result: JSX.Element[] = [];
        apps.forEach((a, index) => {
            var churchApp = null;
            churchApps?.forEach(ca => { if (ca.appName === a.keyName) churchApp = ca; });
            if (churchApp === null) {
                result.push(<tr key={index}><td className="disabled">{a.name}</td><td><a href="about:blank" data-churchid={props.church.id} data-appname={a.keyName} onClick={handleActivate}>Activate</a></td></tr>)
            } else {
                result.push(<tr key={index}><td>{a.name}</td><td>{getManageAccessLink(a.keyName)}</td></tr>)
            }

        });
        return result;
    }

    React.useEffect(loadData, [props.church]);

    return (
        <>
            <ErrorMessages errors={errors} />
            <DisplayBox id="churchSettingsBox" headerIcon="fas fa-church" headerText={"Apps for " + props.church?.name || ""} >
                <table className="table table-sm">
                    <thead><tr><th>Application</th><th>Action</th></tr></thead>
                    <tbody>
                        {getApps()}
                    </tbody>
                </table>
            </DisplayBox>
        </>
    );
}

