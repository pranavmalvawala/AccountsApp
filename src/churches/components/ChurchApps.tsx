import React from 'react';
//import { RoleInterface, RolePermissionInterface } from '../../helpers';
import { ApiHelper, ChurchInterface, DisplayBox, ChurchAppInterface, ApplicationInterface, UserHelper, LoginResponseInterface, ErrorMessages, Permissions } from './';

interface Props { church: ChurchInterface, redirectFunction: (url: string) => void }

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
        else {
            resp = await ApiHelper.post("/users/switchApp", { churchId: churchId, appName: appName }, "AccessApi");
            initApp(appName, resp);
        }
    }
    /*
        const initSLHostPermissions = async (church: ChurchInterface) => {
            //Need to find a way to not hard code this.
            var role: RoleInterface = { appName: "StreamingLive", churchId: church.id, name: "Hosts" };
            role.id = (await ApiHelper.post('/roles', [role]))[0].id;
    
            const permissions: RolePermissionInterface[] = [];
            permissions.push({ churchId: church.id, contentType: "Chat", action: "Host", roleId: role.id });
            await ApiHelper.post('/rolepermissions', permissions);
        }*/

    const initApp = async (appName: string, loginResp: LoginResponseInterface) => {
        /*
        const appJwt = loginResp.token;

        var apiUrl = "";
        var redirectUrl = "";
        var additionalCode = async (church: ChurchInterface) => { }
        switch (appName) {
            case "CHUMS": apiUrl = EnvironmentHelper.ChumsApi; redirectUrl = EnvironmentHelper.ChumsUrl; break;
            case "StreamingLive": apiUrl = EnvironmentHelper.StreamingLiveApi; redirectUrl = EnvironmentHelper.StreamingLiveUrl; additionalCode = initSLHostPermissions; break;
            case "B1": apiUrl = EnvironmentHelper.B1Api; redirectUrl = EnvironmentHelper.B1Url; break;
        }

        if (apiUrl !== "") {
            await additionalCode(props.church);
            const data = { user: loginResp.user, church: props.church }
            var resp: LoginResponseInterface = await ApiHelper.appApiPost(appJwt, apiUrl + "/churches/init", data);
            if (resp.errors !== undefined) { setErrors(resp.errors); }
            else window.location.href = redirectUrl;
        }*/
    }


    const handleEditAccess = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var churchId = parseInt(anchor.getAttribute('data-churchid'), 0);
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
        apps.forEach(a => {
            var churchApp = null;
            churchApps?.forEach(ca => { if (ca.appName === a.keyName) churchApp = ca; });
            if (churchApp === null) {
                result.push(<tr><td className="disabled">{a.name}</td><td><a href="about:blank" data-churchid={props.church.id} data-appname={a.keyName} onClick={handleActivate}>Activate</a></td></tr>)
            } else {
                result.push(<tr><td>{a.name}</td><td>{getManageAccessLink(a.keyName)}</td></tr>)
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
                    <tr><th>Application</th><th>Action</th></tr>
                    {getApps()}
                </table>
            </DisplayBox>
        </>
    );
}

