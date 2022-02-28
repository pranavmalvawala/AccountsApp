import React from "react";
import { UserHelper } from "./";
import { NavLink } from "react-router-dom";
import { Permissions } from "../helpers/Permissions"

interface Props { prefix?: String; }
interface Tab { key: string; url: string; icon: string; label: string; }

export function NavItems({ prefix }: Props) {
  const getTab = ({ key, url, icon, label }: Tab) => (
    <li key={key} className="nav-item" data-toggle={prefix === "main" ? null : "collapse"} data-target={prefix === "main" ? null : "#userMenu"} id={(prefix || "") + key + "Tab"}>
      <NavLink className={prefix === "main" ? "nav-link" : ""} to={url}>
        <i className={icon}></i> {label}
      </NavLink>
    </li>
  );

  const churchId = UserHelper.currentChurch.id
  const tabs = []
  tabs.push(getTab({ key: "Church", url: `/${churchId}`, icon: "fas fa-church", label: "Church" }))
  if (UserHelper.checkAccess(Permissions.accessApi.server.admin)) tabs.push(getTab({ key: "Admin", url: "/admin", icon: "fas fa-user-shield", label: "Admin" }));
  tabs.push(getTab({ key: "Profile", url: "/profile", icon: "fas fa-user", label: "Profile" }));

  return <>{tabs}</>;
};
