import React, {useState} from "react";
import {makeStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import CustomPrimaryContainedButton from "../components/Button/CustomPrimaryContainedButton";
import Box from "@material-ui/core/Box";
import {isValidEmail} from "../utils/ValidationHelper";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export const SignInPage = () => {
  const classes = useStyles();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handleSignInButtonClick = () => {
    const signInInfo = {
      email: email,
      password: password
    }

    try {
      console.log(signInInfo);
    } catch (e) {
      console.log(e)
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
      <Grid item xs={3}>
        <Paper style={{justifyContent: 'center', padding: 64}} className={classes.paper}>
          <Box fontSize={24}>Sign in to your account</Box>
          <Box fontSize={14} style={{marginTop: 24, marginBottom: 24}}>Build skills for today, tomorrow, and beyond.
            Education to future-proof your career.</Box>
          <TextField onChange={handleEmailChange} value={email} label="Email" variant="outlined"/>
          <TextField value={password}
                     onChange={handlePasswordChange} style={{marginTop: 24, marginBottom: 24}} type="password"
                     label="Password"
                     variant="outlined"/>
          <Box>
            <CustomPrimaryContainedButton
              onClick={handleSignInButtonClick}
              disabled={!(isValidEmail(email) > 0 && password?.length > 0)}
              variant="contained"
              color="primary">
              Sign In
            </CustomPrimaryContainedButton>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </div>
}