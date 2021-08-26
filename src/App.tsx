import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./UserContext"
import { Routing } from "./Routing";
import { CookiesProvider } from "react-cookie"

const App: React.FC = () => (
  <UserProvider>
    <CookiesProvider>
      <Router>
        <Routing />
      </Router>
    </CookiesProvider>
  </UserProvider>
)
export default App;

