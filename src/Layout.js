import React from "react";
import {
  Switch,
  Route,
} from "react-router-dom";

import ButtonAppBar from "./components/AppBar/AppBar";
import {SamplePage} from "./views/SamplePage";
import {Homepage} from "./views/Homepage/Homepage";
import {SignUpPage} from "./views/SignUpPage";
import {SignInPage} from "./views/SignInPage";
import PageNotFound from "./components/PageNotFound";
import AdminDashboard from "./views/Admin/Dashboard";

export default function Layout() {
  return (
    <div>
      <ButtonAppBar/>
      <Switch>
        <Route exact path="/" component={Homepage}/>
        <Route exact path="/sample" component={SamplePage}/>
        <Route exact path="/home" component={Homepage}/>
        <Route exact path="/sign-in" component={SignInPage}/>
        <Route exact path="/sign-up" component={SignUpPage}/>
        <Route exact path="/admin" component={AdminDashboard}/>
        <Route component={PageNotFound} />
      </Switch>
    </div>
  );
}