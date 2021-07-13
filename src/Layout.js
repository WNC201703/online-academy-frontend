import React, {useContext} from "react";
import {
  Redirect,
  Switch,
  Route,
} from "react-router-dom";

import ButtonAppBar from "./components/AppBar/AppBar";
import {SamplePage} from "./views/SamplePage";
import {Homepage} from "./views/Homepage/Homepage";
import {SignUpPage} from "./views/SignUpPage";
import {SignInPage} from "./views/SignInPage";
import LearningPage from "./views/Learning/LearningPage";
import PageNotFound from "./components/PageNotFound";
import AdminDashboard from "./views/Admin/Dashboard";
import AuthUserContext from "./contexts/user/AuthUserContext";
import {UserRoles} from "./utils/constant";

export default function Layout() {
  const {user} = useContext(AuthUserContext);
  const isAdmin = user?.role === UserRoles.Admin;

  return (
    <div>
      <ButtonAppBar/>
      <Switch>
        <Route exact path="/" component={Homepage}/>
        <Route exact path="/sample" component={SamplePage}/>
        <Route exact path="/home" component={Homepage}/>
        <Route exact path="/sign-in" component={SignInPage}/>
        <Route exact path="/sign-up" component={SignUpPage}/>
        <Route exact path="/learn" component={LearningPage}/>
        <Route exact path="/not-found" component={PageNotFound}/>
        <Route path="/admin">
          {isAdmin ? <AdminDashboard/> : <Redirect to={{pathname: "/not-found", state: {from: '/'}}}/>}
        </Route>
        <Route component={PageNotFound}/>
      </Switch>
    </div>
  );
}