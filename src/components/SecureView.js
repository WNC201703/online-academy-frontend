import React, {useMemo, useContext} from "react";
import {makeStyles} from "@material-ui/core";
import {Route, Switch} from "react-router-dom";
import './SideBar/styles.scss';
import AuthUserContext from "../contexts/user/AuthUserContext";
import RouteWithLayout from "./RouteWithLayout";
import {UserRoles} from "../utils/constant";
import TeacherLayout from "./Layout/TeacherLayout";
import {CourseManagementTeacher} from "../views/Teacher/Course/CourseManagementTeacher";
import {CourseDetailTeacher} from "../views/Teacher/Course/CourseDetailTeacher";
import {SignInPage} from "../views/SignInPage";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "start",
    alignContent: "start",
    overflow: 'hidden',
    backgroundColor: '#FAFBFC',
  },
  content: {
    maxHeight: '100vh',
    overflowY: 'auto',
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#FAFBFC",
    },
    "&::-webkit-scrollbar": {
      width: 8,
      backgroundColor: "#FAFBFC",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#cdd0cb",
    },
  },
}));

export default function SecureView() {
  const classes = useStyles();
  const {user} = useContext(AuthUserContext);
  const isTeacher = user?.role === UserRoles.Admin;
  return (
    <div className={classes.root}>
      <Switch>
        <Route exact path="/sign-in" component={SignInPage}/>
        <RouteWithLayout shouldRender={isTeacher} layout={TeacherLayout} exact path='/teacher/courses'
                         component={CourseManagementTeacher}/>
        <RouteWithLayout shouldRender={isTeacher} layout={TeacherLayout} exact path='/teacher/courses/:id'
                         component={CourseDetailTeacher}/>
      </Switch>
    </div>
  )
}