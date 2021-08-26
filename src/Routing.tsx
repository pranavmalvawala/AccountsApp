import React from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import { EnvironmentHelper } from "./helpers";
import { ControlPanel } from "./ControlPanel";

export const Routing: React.FC = () => {
  const location = useLocation();
  if (EnvironmentHelper.GoogleAnalyticsTag !== "") {
    ReactGA.initialize(EnvironmentHelper.GoogleAnalyticsTag);
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
  React.useEffect(() => { if (EnvironmentHelper.GoogleAnalyticsTag !== "") ReactGA.pageview(location.pathname + location.search); }, [location]);

  return (
    <Switch>
      <Route path="/"><ControlPanel /></Route>
    </Switch>
  );
}
