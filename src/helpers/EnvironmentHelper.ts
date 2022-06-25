import { ApiHelper } from "../appBase/helpers/ApiHelper";
import { CommonEnvironmentHelper } from "../appBase/helpers/CommonEnvironmentHelper";

export class EnvironmentHelper {
  static GoogleAnalyticsTag = "";
  static Common = CommonEnvironmentHelper;

  static init = () => {
    let stage = process.env.REACT_APP_STAGE;

    switch (stage) {
      case "staging": EnvironmentHelper.initStaging(); break;
      case "prod": EnvironmentHelper.initProd(); break;
      default: EnvironmentHelper.initDev(); break;
    }
    EnvironmentHelper.Common.init(stage)

    ApiHelper.apiConfigs = [
      { keyName: "AccessApi", url: EnvironmentHelper.Common.AccessApi, jwt: "", permisssions: [] },
      { keyName: "GivingApi", url: EnvironmentHelper.Common.GivingApi, jwt: "", permisssions: [] },
      { keyName: "MembershipApi", url: EnvironmentHelper.Common.MembershipApi, jwt: "", permisssions: [] },
      { keyName: "ReportingApi", url: EnvironmentHelper.Common.ReportingApi, jwt: "", permisssions: [] }
    ];
  }

  static initDev = () => {
    EnvironmentHelper.GoogleAnalyticsTag = process.env.REACT_APP_GOOGLE_ANALYTICS || "";
  }

  //NOTE: None of these values are secret.
  static initStaging = () => {
    EnvironmentHelper.GoogleAnalyticsTag = "";
  }

  //NOTE: None of these values are secret.
  static initProd = () => {
    EnvironmentHelper.GoogleAnalyticsTag = "UA-164774603-7";
  }

}

