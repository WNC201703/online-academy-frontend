import React, {useContext, useState} from "react";
import {makeStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CustomPrimaryContainedButton from "../components/Button/CustomPrimaryContainedButton";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {isValidEmail} from "../utils/ValidationHelper";
import CircularProgress from "@material-ui/core/CircularProgress";
import {signIn, sendVerificationEmail} from "../config/api/User";
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
}));

export const SignInPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const {saveUser} = useContext(AuthUserContext);
  const {enqueueSnackbar} = useSnackbar();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const resendVerificationEmail = async () => {
    const res = await sendVerificationEmail({email: email});
    if (res.status === 200) {
      setIsSent(true);
    } else {
      if (res.status === 400) {
        enqueueSnackbar(`${res.data?.error_message}`, {variant: SnackBarVariant.Error});
      }
    }
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
      localStorage.setItem(LocalKey.UserInfo, JSON.stringify(user));
      saveUser(user);
      if (user.role === UserRoles.Admin) {
        history.push('/');
      } else if (user.role === UserRoles.Teacher) {
        history.push('/teacher/courses');
      } else history.push('/');


      enqueueSnackbar("Sign in successfully", {variant: SnackBarVariant.Success});
    } else {
      //email or password is incorrect
      if (res.status === 401) {
        enqueueSnackbar("Can not sign in to your account, please check your email and password.", {variant: SnackBarVariant.Error});
      } else {
        console.log(res);
        //email is not verified
        if (res.status === 403) {
          setEmailNotVerified(true);
        } else {
          enqueueSnackbar("Can not sign in to your account", {variant: SnackBarVariant.Error});
        }
      }
    }
    setIsPending(false);
  }

  if (emailNotVerified) {
    return <div className={classes.root}>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{minHeight: '100vh'}}>
        <Grid item xs={6}>
          <div style={{justifyContent: 'center'}} className={classes.paper}>
            <Typography variant="h6">
              {`You have to confirm your email: ${email} address before continuing`}
            </Typography>
            {isSent
              ?
              <Typography>
                {`A verification link has been sent to your email account.`}
              </Typography>
              :
              <Button variant="outlined" color="primary" onClick={resendVerificationEmail}>Resend verification
                email</Button>
            }


          </div>
        </Grid>
      </Grid>
    </div>
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