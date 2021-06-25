import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router} from "react-router-dom";
import React from "react";
import AppSnackbarProvider from "./contexts/SnackBarProvider";
import AuthUserContextProvider from "./contexts/user/AuthUserContextProvider";

function App() {
  return (
    <Router>
      <AuthUserContextProvider>
        <AppSnackbarProvider>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo"/>
              <p>
                Edit <code>src/App.js</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer">
                Learn React
              </a>
            </header>
          </div>
        </AppSnackbarProvider>
      </AuthUserContextProvider>
    </Router>
  );
}

export default App;
