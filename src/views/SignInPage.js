import React, {useContext, useState} from "react";
import {makeStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import CustomPrimaryContainedButton from "../components/Button/CustomPrimaryContainedButton";
import Box from "@material-ui/core/Box";
import {isValidEmail} from "../utils/ValidationHelper";
import CircularProgress from "@material-ui/core/CircularProgress";
import {signIn} from "../config/api/User";
import {SnackBarVariant} from "../utils/constant";
import {useSnackbar} from "notistack";
import {saveAccessToken} from "../utils/LocalStorageUtils";
import AuthUserContext from "../contexts/user/AuthUserContext";

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

export const SignInPage = () => {
  const classes = useStyles();
  const {saveUser} = useContext(AuthUserContext);
  const {enqueueSnackbar} = useSnackbar();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handleSignInButtonClick = async () => {
    setIsPending(true);

    const signInInfo = {
      email: email,
      password: password
    }

    const res = await signIn(signInInfo);
    if (res.status === 200) {
      const {accessToken, user} = res.data;
      delete user['password'];
      saveAccessToken(accessToken);
      saveUser(user);
      enqueueSnackbar("Sign in successfully", {variant: SnackBarVariant.Success});

    } else {
      enqueueSnackbar("Can not sign in to your account", {variant: SnackBarVariant.Error});
    }
    setIsPending(false);
  }

  return <div className={classes.root}>
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{minHeight: '100vh'}}>
      <Grid item xs={3}>
        <Paper style={{justifyContent: 'center', padding: 48}} className={classes.paper}>
          <Box className={classes.formTitle}>Sign in to your account</Box>
          <Box fontSize={14} style={{marginTop: 24, marginBottom: 24}}>Build skills for
            today, tomorrow, and beyond.
            Education to future-proof your career.</Box>
          <TextField fullWidth onChange={handleEmailChange} value={email} label="Email" variant="outlined"/>
          <TextField fullWidth value={password}
                     onChange={handlePasswordChange} style={{marginTop: 24, marginBottom: 24}} type="password"
                     label="Password"
                     variant="outlined"/>
          <Box>
            {
              isPending ? <CircularProgress/> : <CustomPrimaryContainedButton
                onClick={handleSignInButtonClick}
                disabled={!(isValidEmail(email) > 0 && password?.length > 0)}
                variant="contained"
                color="primary">
                Sign In
              </CustomPrimaryContainedButton>
            }
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </div>
}