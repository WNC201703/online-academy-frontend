import React from "react";
import {
  Switch,
  Route,
} from "react-router-dom";

import ButtonAppBar from "./components/AppBar/AppBar";
import {SamplePage} from "./views/SamplePage";
import {Homepage} from "./views/Homepage";


export default function Layout() {
  return (
    <div>
      <ButtonAppBar />
      <Switch>
        <Route path="/sample" component={SamplePage} />
        <Route path="/home" component={Homepage} />

      </Switch>
    </div>
  );
}