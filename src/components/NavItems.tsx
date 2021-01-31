import React from "react";
import { UserHelper } from "./";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Permissions }  from '../helpers/Permissions'

interface Props {
  prefix?: String;
}

export const NavItems: React.FC<Props> = (props) => {
  const location = useLocation();

  const getSelected = (): string => {
    var url = location.pathname;
    var result = "People";
    if (url.indexOf("/admin") > -1) result = "Admin";


    return result;
  };

  const getClass = (sectionName: string): string => {
    if (sectionName === getSelected()) return "nav-link active";
    else return "nav-link";
  };

  const getTab = (key: string, url: string, icon: string, label: string) => {
    return (
      <li key={key} className="nav-item" data-toggle={props.prefix === "main" ? null : "collapse"} data-target={props.prefix === "main" ? null : "#userMenu"} id={(props.prefix || "") + key + "Tab"}>
        <Link className={getClass(key)} to={url}>
          <i className={icon}></i> {label}
        </Link>
      </li>
    );
  };

  const getTabs = () => {
    var tabs = [];
    tabs.push(getTab("Church", "/churches", "fas fa-church", "Church"));
    if (UserHelper.checkAccess(Permissions.accessApi.server.admin)) tabs.push(getTab("Admin", "/admin", "fas fa-user-shield", "Admin"));
    tabs.push(getTab("Profile", "/profile", "fas fa-user", "Profile"));
    return tabs;
  };

  return <>{getTabs()}</>;
};
