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
import {EmailConfirmationPage} from "./views/EmailConfirmationPage";
import LearningPage from "./views/Learning/LearningPage";
import PageNotFound from "./components/PageNotFound";
import AdminDashboard from "./views/Admin/Dashboard";
import AuthUserContext from "./contexts/user/AuthUserContext";
import {UserRoles} from "./utils/constant";
import {CourseDetail} from "./views/CourseDetail/CourseDetailPage";
import {ProfilePage} from "./views/ProfilePage";
import {CourseList} from "./views/CourseList/CourseList";
import RouteWithLayout from "./components/RouteWithLayout";
import TeacherLayout from "./components/Layout/TeacherLayout";
import {CourseManagementTeacher} from "./views/Teacher/Course/CourseManagementTeacher";
import {CourseDetailTeacher} from "./views/Teacher/Course/CourseDetailTeacher";
import SecureView from "./components/SecureView";

export default function Layout() {
  const {user} = useContext(AuthUserContext);
  const isAdmin = user?.role === UserRoles.Admin;
  const isTeacher = user?.role === UserRoles.Admin;
  const isStudent = user?.role === UserRoles.Student;
  const isAdminOrTeacher = !isStudent
  return (
    <div>
      <ButtonAppBar/>
      <Switch>
        <Route exact path="/" component={Homepage}/>
        <Route exact path="/sample" component={SamplePage}/>
        <Route exact path="/home" component={Homepage}/>
        <Route exact path="/sign-in" component={SignInPage}/>
        <Route exact path="/sign-up" component={SignUpPage}/>
        <Route exact path="/confirm-email/:token" component={EmailConfirmationPage}/>
        <Route exact path="/not-found" component={PageNotFound}/>
        <Route exact path="/courses/all/" component={CourseList}/>
        <Route exact path="/courses/all/:categoryId" component={CourseList}/>
        <Route exact path="/courses/:id" component={CourseDetail}/>
        <Route path="/profile">
          {user?._id ? <ProfilePage/> : <Redirect to={{pathname: "/not-found", state: {from: '/'}}}/>}
        </Route>
        <Route exact path="/me/:type">
          {user?._id ? <CourseList/> : <Redirect to={{pathname: "/not-found", state: {from: '/'}}}/>}
        </Route>
        <Route path="/courses/:courseId/learn" component={LearningPage}/>
        <Route path="/admin">
          {isAdmin ? <AdminDashboard/> : <Redirect to={{pathname: "/not-found", state: {from: '/'}}}/>}
        </Route>

        <RouteWithLayout layout={TeacherLayout} exact path='/teacher/courses'
                         component={CourseManagementTeacher}/>
        <RouteWithLayout layout={TeacherLayout} exact path='/teacher/courses/:id'
                         component={CourseDetailTeacher}/>
        <Route component={PageNotFound}/>
      </Switch>
    </div>
  );
}