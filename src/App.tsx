import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./UserContext"
import { Routing } from "./Routing";
import { CookiesProvider } from "react-cookie"
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const mdTheme = createTheme({
  palette: {
    secondary: {
      main: "#444444"
    }
  },
  components: {
    MuiTextField: { defaultProps: { margin: "normal" } },
    MuiFormControl: { defaultProps: { margin: "normal" } }
  }
});

const App: React.FC = () => (
  <UserProvider>
    <CookiesProvider>
      <ThemeProvider theme={mdTheme}>
        <CssBaseline />
        <Router>
          <Routing />
        </Router>
      </ThemeProvider>
    </CookiesProvider>
  </UserProvider>
)
export default App;

