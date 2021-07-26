import React, {useContext, useEffect, useState} from "react";
import {
    useParams,
  } from "react-router-dom";
import {makeStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import {verifyEmail} from "../config/api/User";
import {LocalKey, SnackBarVariant, UserRoles} from "../utils/constant";
import {useSnackbar} from "notistack";
import AuthUserContext from "../contexts/user/AuthUserContext";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  formTitle: {
    fontWeight: "bold",
    fontSize: 26
  },
}));

export const EmailConfirmationPage = () => {
  const classes = useStyles();
  const { token } = useParams();
  const history = useHistory();
  const {user} = useContext(AuthUserContext);
  const {enqueueSnackbar} = useSnackbar();
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const eff = async () => {
      await verifyEmail();
    }
    eff();
  }, []);

  const fetchProfile = async () => {
    setIsPending(true);
    const res= await verifyEmail(token);
    try {
      if (res.status === 200) {
          
      }
    } catch (e) {
      enqueueSnackbar("Error, can not get course list", {variant: SnackBarVariant.Error});
      console.log(e);
    } finally {
      setIsPending(false);
    }
  }

  return <div className={classes.root}>
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{minHeight: '100vh'}}>
      <Grid item xs={9}>
        <Paper style={{justifyContent: 'center', padding: 48}} className={classes.paper}>
          <Box className={classes.formTitle}>{`${token}`}</Box>
     
        </Paper>
      </Grid>
    </Grid>
  </div>
}