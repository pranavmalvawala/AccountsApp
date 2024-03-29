import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import { EnvironmentHelper } from "./helpers";
import { ControlPanel } from "./ControlPanel";
import { Box } from "@mui/material";

export const Routing: React.FC = () => {
  const location = useLocation();
  if (EnvironmentHelper.GoogleAnalyticsTag !== "") {
    ReactGA.initialize(EnvironmentHelper.GoogleAnalyticsTag);
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
  React.useEffect(() => { if (EnvironmentHelper.GoogleAnalyticsTag !== "") ReactGA.pageview(location.pathname + location.search); }, [location]);

  return (
    <Box sx={{ display: "flex", backgroundColor: "#EEE", minHeight: "100vh" }}>
      <Routes>
        <Route path="/*" element={<ControlPanel />} />
      </Routes>
    </Box>
  );
}
