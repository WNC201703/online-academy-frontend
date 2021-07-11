import React, {useMemo, useContext} from "react";
import { makeStyles } from "@material-ui/core";
import Route, { Switch } from "react-router-dom";
import './SideBar/styles.scss';
import Box from "@material-ui/core/Box";
import AuthUserContext from "../contexts/user/AuthUserContext";
import RouteWithLayout from "./RouteWithLayout";
import MainAppBarLayout from "./MainAppBarLayout";
import {Homepage} from "../views/Homepage/Homepage";
import PrimarySearchAppBar from "./AppBar/AppBar";
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

export default function SecureView(){
  const classes = useStyles();
  const { user } = useContext(AuthUserContext);

  return (
      <div className={classes.root}>
        <PrimarySearchAppBar />
        <Box mt="65px" width={1} height={1} className={classes.content}>
          <Switch>
            <RouteWithLayout
              exact path="/home"
              layout={MainAppBarLayout}
              component={Homepage}
            />
          </Switch>
        </Box>
      </div>
  )
}