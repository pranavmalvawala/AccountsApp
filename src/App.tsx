import React from 'react';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from './UserContext'
import { Routing } from "./Routing";

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Routing />
      </Router>
    </UserProvider>
  );
}
export default App;

