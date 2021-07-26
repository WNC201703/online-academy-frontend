import React, {useContext, useEffect, useState} from "react";
import {
    useParams,
  } from "react-router-dom";
import {makeStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import {verifyEmail} from "../config/api/User";
import {LocalKey, SnackBarVariant, UserRoles} from "../utils/constant";
import {useSnackbar} from "notistack";
import {saveAccessToken} from "../utils/LocalStorageUtils";
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
  circularProgress: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
    marginTop: 24,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export const EmailConfirmationPage = () => {
  const classes = useStyles();
  const { token } = useParams();
  const {saveUser} = useContext(AuthUserContext);
  const history = useHistory();
  const {enqueueSnackbar} = useSnackbar();
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    const eff = async () => {
      await confirmEmail();
    }
    eff();
  }, []);

  const confirmEmail = async () => {
    setIsPending(true);
    const res= await verifyEmail(token);
    console.log(res);
    try {
      if (res.status === 200) {
        //login user
        const {accessToken, user} = res.data;
        saveAccessToken(accessToken);
        localStorage.setItem(LocalKey.UserInfo, JSON.stringify(user));
        saveUser(user);
        enqueueSnackbar("Your account has been successfully verified", { variant: SnackBarVariant.Success });
        history.push('/');
      }
      else {
          if (res.status === 400 || res.status === 401){
                setErrorMessage(res.data?.error_message);
          }
      }
    } catch (e) {
      enqueueSnackbar("Error, something went wrong", {variant: SnackBarVariant.Error});
      console.log(e);
    } finally {
      setIsPending(false);
    }
  }
  if (isPending) 
  return <div className={classes.circularProgress}>
     <CircularProgress  size={30}/>
  </div>

  if (errorMessage) 
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
          <Box className={classes.formTitle}>{
           `${errorMessage}`
          }
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </div>;

  return <div></div>;
}