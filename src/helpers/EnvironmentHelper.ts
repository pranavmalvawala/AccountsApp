import { ApiHelper } from "../appBase/helpers/ApiHelper";

export class EnvironmentHelper {
  static StreamingLiveUrl = "";
  static ChumsUrl = "";
  static B1Url = "";
  static LessonsUrl = "";
  static ContentRoot = "";

  private static AccessApi = "";
  private static GivingApi = "";
  private static MembershipApi = "";
  private static ReportingApi = "";
  static GoogleAnalyticsTag = "";

  static init = () => {
    switch (process.env.REACT_APP_STAGE) {
      case "staging": EnvironmentHelper.initStaging(); break;
      case "prod": EnvironmentHelper.initProd(); break;
      default: EnvironmentHelper.initDev(); break;
    }
    ApiHelper.apiConfigs = [
      { keyName: "AccessApi", url: EnvironmentHelper.AccessApi, jwt: "", permisssions: [] },
      { keyName: "GivingApi", url: EnvironmentHelper.GivingApi, jwt: "", permisssions: [] },
      { keyName: "MembershipApi", url: EnvironmentHelper.MembershipApi, jwt: "", permisssions: [] },
      { keyName: "ReportingApi", url: EnvironmentHelper.ReportingApi, jwt: "", permisssions: [] },
      { keyName: "LessonsApi", url: "", jwt: "", permisssions: [] },
      { keyName: "AttendanceApi", url: "", jwt: "", permisssions: [] },
      { keyName: "MessagingApi", url: "", jwt: "", permisssions: [] }
    ];
  }

  static initDev = () => {
    EnvironmentHelper.AccessApi = process.env.REACT_APP_ACCESS_API || "";
    EnvironmentHelper.ContentRoot = process.env.REACT_APP_CONTENT_ROOT || "";
    EnvironmentHelper.StreamingLiveUrl = process.env.REACT_APP_STREAMINGLIVE_URL || "";
    EnvironmentHelper.GivingApi = process.env.REACT_APP_GIVING_API || "";
    EnvironmentHelper.ChumsUrl = process.env.REACT_APP_CHUMS_URL || "";
    EnvironmentHelper.B1Url = process.env.REACT_APP_B1_URL || "";
    EnvironmentHelper.MembershipApi = process.env.REACT_APP_MEMBERSHIP_API || "";
    EnvironmentHelper.ReportingApi = process.env.REACT_APP_REPORTING_API || "";
    EnvironmentHelper.LessonsUrl = process.env.REACT_APP_LESSONS_URL || ""
    EnvironmentHelper.GoogleAnalyticsTag = process.env.REACT_APP_GOOGLE_ANALYTICS || "";
  }

  //NOTE: None of these values are secret.
  static initStaging = () => {
    EnvironmentHelper.AccessApi = "https://accessapi.staging.churchapps.org";
    EnvironmentHelper.ContentRoot = "";
    EnvironmentHelper.StreamingLiveUrl = "https://{key}.staging.streaminglive.church";
    EnvironmentHelper.GivingApi = "https://givingapi.staging.churchapps.org";
    EnvironmentHelper.ChumsUrl = "https://app.staging.chums.org";
    EnvironmentHelper.B1Url = "https://{key}.staging.b1.church";
    EnvironmentHelper.MembershipApi = "https://membershipapi.staging.churchapps.org";
    EnvironmentHelper.ReportingApi = "https://reportingapi.staging.churchapps.org";
    EnvironmentHelper.LessonsUrl = "https://staging.lessons.church"
    EnvironmentHelper.GoogleAnalyticsTag = "";
  }

  //NOTE: None of these values are secret.
  static initProd = () => {
    EnvironmentHelper.AccessApi = "https://accessapi.churchapps.org";
    EnvironmentHelper.ContentRoot = "";
    EnvironmentHelper.StreamingLiveUrl = "https://{key}.streaminglive.church";
    EnvironmentHelper.GivingApi = "https://givingapi.churchapps.org";
    EnvironmentHelper.ChumsUrl = "https://app.chums.org";
    EnvironmentHelper.B1Url = "https://{key}.b1.church";
    EnvironmentHelper.MembershipApi = "https://membershipapi.churchapps.org";
    EnvironmentHelper.ReportingApi = "https://reportingapi.churchapps.org";
    EnvironmentHelper.LessonsUrl = "https://lessons.church"
    EnvironmentHelper.GoogleAnalyticsTag = "UA-164774603-7";
  }

}

