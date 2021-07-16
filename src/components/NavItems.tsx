import React from "react";
import { UserHelper } from "./";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Permissions }  from "../helpers/Permissions"

interface Props {
  prefix?: String;
}

interface Tab {
  key: string;
  url: string;
  icon: string;
  label: string;
}

export function NavItems({ prefix }: Props) {
  const location = useLocation();

  const getSelected = (): string => {
    let url = location.pathname;
    let result = "Church";
    if (url.indexOf("/admin") > -1) result = "Admin";
    if (url.indexOf("/churches") > -1) result = "Church";
    if (url.indexOf("/profile") > -1) result = "Profile";

    return result;
  };

  const getClass = (sectionName: string): string => {
    if (sectionName === getSelected()) return prefix === "main" ? "nav-link active" : "active";
    else return prefix === "main" ? "nav-link" : "";
  };

  const getTab = ({ key, url, icon, label }: Tab) => (
    <li key={key} className="nav-item" data-toggle={prefix === "main" ? null : "collapse"} data-target={prefix === "main" ? null : "#userMenu"} id={(prefix || "") + key + "Tab"}>
      <Link className={getClass(key)} to={url}>
        <i className={icon}></i> {label}
      </Link>
    </li>
  );

  const getTabs = () => {
    let tabs = [];
    tabs.push(getTab({ key: "Church", url: "/churches", icon: "fas fa-church", label: "Church" }));
    if (UserHelper.checkAccess(Permissions.accessApi.server.admin)) tabs.push(getTab({ key: "Admin", url: "/admin", icon: "fas fa-user-shield", label: "Admin" }));
    tabs.push(getTab({ key: "Profile", url: "/profile", icon: "fas fa-user", label: "Profile" }));
    return tabs;
  };

  return <>{getTabs()}</>;
};
