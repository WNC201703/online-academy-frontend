import React from "react";
import {
  Switch,
  Route,
} from "react-router-dom";

import ButtonAppBar from "./components/AppBar/AppBar";
import {SamplePage} from "./views/SamplePage";
import {Homepage} from "./views/Homepage";
import {SignUpPage} from "./views/SignUpPage";
import {SignInPage} from "./views/SignInPage";
import PageNotFound from "./components/PageNotFound";

export default function Layout() {
  return (
    <div>
      <ButtonAppBar/>
      <Switch>
        <Route exact path="/" component={SamplePage}/>
        <Route exact path="/sample" component={SamplePage}/>
        <Route exact path="/home" component={Homepage}/>
        <Route exact path="/sign-in" component={SignInPage}/>
        <Route exact path="/sign-up" component={SignUpPage}/>
        <Route component={PageNotFound} />
      </Switch>
    </div>
  );
}