import { ApiHelper } from "../appBase/helpers/ApiHelper";

export class EnvironmentHelper {
    static StreamingLiveUrl = "";
    static ChumsUrl = "";
    static B1Url = "";
    static ContentRoot = "";
    static SupportEmail = "";

    private static AccessApi = "";
    private static StreamingLiveApi = "";
    private static GivingApi = "";
    private static B1Api = "";
    static GoogleAnalyticsTag = "";

    static init = () => {
        switch (process.env.REACT_APP_STAGE) {
            case "staging": EnvironmentHelper.initStaging(); break;
            case "prod": EnvironmentHelper.initProd(); break;
            default: EnvironmentHelper.initDev(); break;
        }
        ApiHelper.apiConfigs = [
            { keyName: "AccessApi", url: EnvironmentHelper.AccessApi, jwt: "", permisssions: [] },
            { keyName: "StreamingLiveApi", url: EnvironmentHelper.StreamingLiveApi, jwt: "", permisssions: [] },
            { keyName: "GivingApi", url: EnvironmentHelper.GivingApi, jwt: "", permisssions: [] },
            { keyName: "AcceB1ApissApi", url: EnvironmentHelper.B1Api, jwt: "", permisssions: [] }
        ];
        ApiHelper.defaultApi = "AccessApi";
    }

    static initDev = () => {
        EnvironmentHelper.AccessApi = process.env.REACT_APP_ACCESS_API || "";
        EnvironmentHelper.ContentRoot = process.env.REACT_APP_CONTENT_ROOT || "";
        EnvironmentHelper.StreamingLiveApi = process.env.REACT_APP_STREAMINGLIVE_API || "";
        EnvironmentHelper.StreamingLiveUrl = process.env.REACT_APP_STREAMINGLIVE_URL || "";
        EnvironmentHelper.GivingApi = process.env.REACT_APP_GIVING_API || "";
        EnvironmentHelper.ChumsUrl = process.env.REACT_APP_CHUMS_URL || "";
        EnvironmentHelper.B1Api = process.env.REACT_APP_B1_API || "";
        EnvironmentHelper.B1Url = process.env.REACT_APP_B1_URL || "";
        EnvironmentHelper.GoogleAnalyticsTag = process.env.REACT_APP_GOOGLE_ANALYTICS || "";
        EnvironmentHelper.SupportEmail = process.env.REACT_APP_SUPPORT_EMAIL;
    }

    //NOTE: None of these values are secret.
    static initStaging = () => {
        EnvironmentHelper.AccessApi = "https://accessapi.staging.churchapps.org";
        EnvironmentHelper.ContentRoot = "";
        EnvironmentHelper.StreamingLiveApi = "https://api.staging.streaminglive.church";
        EnvironmentHelper.StreamingLiveUrl = "https://admin.staging.streaminglive.church";
        EnvironmentHelper.GivingApi = "https://givingapi.staging.churchapps.org";
        EnvironmentHelper.ChumsUrl = "https://app.staging.chums.org";
        EnvironmentHelper.B1Api = "https://api.staging.b1.church";
        EnvironmentHelper.B1Url = "https://app.staging.b1.church";
        EnvironmentHelper.GoogleAnalyticsTag = "";
        EnvironmentHelper.SupportEmail = "support@churchapps.org";
    }

    //NOTE: None of these values are secret.
    static initProd = () => {
        EnvironmentHelper.AccessApi = "https://accessapi.churchapps.org";
        EnvironmentHelper.ContentRoot = "";
        EnvironmentHelper.StreamingLiveApi = "https://api.streaminglive.church";
        EnvironmentHelper.StreamingLiveUrl = "https://admin.streaminglive.church";
        EnvironmentHelper.GivingApi = "https://givingapi.churchapps.org";
        EnvironmentHelper.ChumsUrl = "https://app.chums.org";
        EnvironmentHelper.B1Api = "https://api.b1.church";
        EnvironmentHelper.B1Url = "https://app.b1.church";
        EnvironmentHelper.GoogleAnalyticsTag = "UA-164774603-7";
        EnvironmentHelper.SupportEmail = "support@churchapps.org";
    }

}

