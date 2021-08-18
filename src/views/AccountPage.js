import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import CustomPrimaryContainedButton from "../components/Button/CustomPrimaryContainedButton";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getInfo , updateMyAccount } from "../config/api/User";
import {  SnackBarVariant } from "../utils/constant";
import { useSnackbar } from "notistack";
import AuthUserContext from "../contexts/user/AuthUserContext";
import { useHistory } from "react-router-dom";
import { isValidEmail, isValidName } from "../utils/ValidationHelper";
import LockIcon from '@material-ui/icons/Lock';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Email from '@material-ui/icons/Email';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  paper: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  formTitle: {
    fontWeight: "bold",
    color: 'black',
    fontSize: 26
  },
  formDesc: {
    fontWeight: "normal",
    color: 'black',
    fontSize: 15
  },
  margin: {
    margin: theme.spacing(2),
  },
  circularProgress: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
    marginTop: 100,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export const AccountPage = () => {
  const classes = useStyles();
  const { saveUser } = useContext(AuthUserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isPending, setIsPending] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [account, setAccount] = useState(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const [emailFieldError, setEmailFieldError] = useState(false);
  const [fullNameFieldError, setFullNameFieldError] = useState(false);
  const [passwordFieldError, setPasswordFieldError] = useState(false);

  const [changePasswordChecked, setChangePasswordChecked] = useState(false);
  const [openCurrentPasswordDialog, setOpenCurrentPasswordDialog] = useState(false);

  useEffect(() => {
    const eff = async () => {
      await fetchAccount();
    }
    eff();
  }, []);

  const handleUpdateAccount= (data) =>{
      setEmail(data.email);
      setFullName(data.fullname);
      setChangePasswordChecked(false);
      setPassword('');
      setAccount(data);
  }

  const fetchAccount = async () => {
    setIsPending(true);
    try {
      const res = await getInfo();
      if (res.status === 200) {
        const data = res.data;
        handleUpdateAccount(data);
      }
    } catch (e) {
      enqueueSnackbar("Error, can not get course list", { variant: SnackBarVariant.Error });
      console.log(e);
    } finally {
      setIsPending(false);
    }
  }

  const handleCheckBoxChange = (event) => {
    setChangePasswordChecked(event.target.checked);
    setPassword('');
  };

  const handleNameChange = (event) => {
    setFullName(event.target.value);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleOpenCurrentPasswordDialog = () => {
    setOpenCurrentPasswordDialog(true);
  };

  const handleCloseCurrentPasswordDialog = () => {
    setOpenCurrentPasswordDialog(false);
  };

  const handleCurrentPasswordChange = (event) => {
    setCurrentPassword(event.target.value);
  }

  const handleConfirmCurrentPassword = async () => {
    if (currentPassword.length === 0) {
      return;
    }
    setOpenCurrentPasswordDialog(false);
    setIsUpdating(true);

    try {
      const body = {
        currentPassword: currentPassword
      };
      if (account.fullname !== fullName) body['fullname'] = fullName;
      if (account.email !== email) body['email'] = email;
      if (changePasswordChecked) body['password'] = password;
      const res = await updateMyAccount(body);
      console.log(res);

      switch (res.status) {
        case 200:
          enqueueSnackbar("Update successfully", { variant: SnackBarVariant.Success });
          handleUpdateAccount(res.data?.user);
          saveUser(res.data?.user);

          break;

        case 401:
          enqueueSnackbar("You current password is missing or incorrect", { variant: SnackBarVariant.Error });
          handleUpdateAccount(account);
          break;
        case 400:
        default:
          enqueueSnackbar("Update failed", { variant: SnackBarVariant.Error });
          handleUpdateAccount(account);
      }
     


    } catch (e) {

    } finally {
      setCurrentPassword('');
      setIsUpdating(false);
    }
  }

  const handleUpdateButtonClick = () => {
    setFullNameFieldError(false);
    setEmailFieldError(false);
    setPasswordFieldError(false);

    if (fullName.length === 0) {
      setFullNameFieldError(true);
      return;
    }

    if (changePasswordChecked && password.length < 6) {
      setPasswordFieldError(true);
      return;
    }

    if (!isValidEmail(email)) {
      setEmailFieldError(true);
      return;
    }

    handleOpenCurrentPasswordDialog();


  }

  if (isPending)
    return <div className={classes.circularProgress}>
      <CircularProgress size={30} />
    </div>

  return <div className={classes.root}>

    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh' }}>
      <Grid item xs={12}>
        <Paper style={{ justifyContent: 'center', padding: 48 }} className={classes.paper}>
          <div>
            <Box className={classes.formTitle}>Your account</Box>
            <Box className={classes.formDesc}>Update your account here.</Box>
          </div>
          <FormControl variant='outlined'
            fullWidth
            className={classes.margin}
          >
            <InputLabel >Full name</InputLabel>
            <Input
              id="fullname"
              onChange={handleNameChange}

              value={fullName}

              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
              error={fullNameFieldError}
            />
          </FormControl>

          <FormControl variant='outlined'
            fullWidth
            className={classes.margin}
          >
            <InputLabel >Email</InputLabel>
            <Input
              id="email"
              type='email'
              onChange={handleEmailChange}
              value={email}
              startAdornment={
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              }
              error={emailFieldError}
            />
          </FormControl>
          <FormControl variant='outlined'
            fullWidth
            className={classes.margin}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={changePasswordChecked}
                  onChange={handleCheckBoxChange}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Change my password"
            />
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <InputLabel>New Password</InputLabel>
            <Input
              id="password"
              onChange={handlePasswordChange}
              type="password"
              value={password}
              disabled={changePasswordChecked ? false : true}
              disableUnderline={changePasswordChecked ? false : true}
              error={passwordFieldError}
              startAdornment={
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              }
            />
          </FormControl>



          <div>
            <Box>
              {
                isUpdating ? <CircularProgress /> :
                  <CustomPrimaryContainedButton
                    onClick={handleUpdateButtonClick}
                    variant="contained"
                    color="primary">
                    Update Info
                  </CustomPrimaryContainedButton>
              }
            </Box>
          </div>
        </Paper>
      </Grid>
    </Grid>

    <div>
      <Dialog
        open={openCurrentPasswordDialog}
        onClose={handleCloseCurrentPasswordDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Enter current password</DialogTitle>
        <DialogContent fullWidth>
          <DialogContentText id="alert-dialog-description">
            <TextField variant="outlined"
              autoFocus
              margin="dense"
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
              label="Current Password"
              type="password"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCurrentPasswordDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmCurrentPassword} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>

  </div>
}

