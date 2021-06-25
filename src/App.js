import './App.css';
import {BrowserRouter as Router} from "react-router-dom";
import React from "react";
import AppSnackbarProvider from "./contexts/SnackBarProvider";
import AuthUserContextProvider from "./contexts/user/AuthUserContextProvider";
import Layout from "./Layout";

function App() {
  return (
    <Router>
      <AuthUserContextProvider>
        <AppSnackbarProvider>
          <Layout/>
        </AppSnackbarProvider>
      </AuthUserContextProvider>
    </Router>
  );
}

export default App;
