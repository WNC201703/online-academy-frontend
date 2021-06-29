import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import CustomPrimaryContainedButton from "../components/Button/CustomPrimaryContainedButton";
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
  formTitle: {
    fontWeight: "bold",
    fontSize: 26
  },
}));

export const SignUpPage = () => {
  const classes = useStyles();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  }

  const handleSignUpButtonClick = () => {
    const userInfo = {
      fullname: fullName,
      email: email,
      password: password
    }

    try {
      console.log(userInfo);

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
        <Paper style={{justifyContent: 'center', padding: 48}} className={classes.paper}>
          <Box className={classes.formTitle}>Create your account</Box>
          <Box fontSize={14} style={{marginTop: 24}}>Build skills for today, tomorrow, and beyond.
            Education to future-proof your career.</Box>
          <TextField fullWidth onChange={handleFullNameChange} style={{marginTop: 24, marginBottom: 24}}
                     value={fullName}
                     label="Full Name" variant="outlined"/>
          <TextField fullWidth onChange={handleEmailChange} value={email} label="Email" variant="outlined"/>
          <TextField fullWidth value={password}
                     onChange={handlePasswordChange} style={{marginTop: 24, marginBottom: 24}} type="password"
                     label="Password"
                     variant="outlined"/>
          <Box>
            <CustomPrimaryContainedButton
              onClick={handleSignUpButtonClick}
              disabled={!(isValidEmail(email) > 0 && password?.length > 0)}
              variant="contained"
              color="primary">
              Sign Up
            </CustomPrimaryContainedButton>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </div>
}