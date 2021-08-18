import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import CustomPrimaryContainedButton from "../../components/Button/CustomPrimaryContainedButton";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getMyProfile, updateMyProfile } from "../../config/api/User";
import { SnackBarVariant } from "../../utils/constant";
import { useSnackbar } from "notistack";
import AuthUserContext from "../../contexts/user/AuthUserContext";
import InfoIcon from '@material-ui/icons/Pages';
import AccountCircle from '@material-ui/icons/AccountCircle';

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

export const TeacherProfilePage = () => {
  const classes = useStyles();
  const { saveUser } = useContext(AuthUserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isPending, setIsPending] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [introduction, setIntroduction] = useState('');
  const [name, setName] = useState('');
  const [nameFieldError, setNameFieldError] = useState(false);
  const [introductionFieldError, setIntroductionFieldError] = useState(false);


  useEffect(() => {
    const eff = async () => {
      await fetchProfile();
    }
    eff();
  }, []);

  const handleUpdateProfile = (data) => {
    setIntroduction(data.introduction);
    setName(data.name);
  }

  const fetchProfile = async () => {
    setIsPending(true);
    try {
      const res = await getMyProfile();
      if (res.status === 200) {
        const data = res.data;
        console.log(res.data);
        handleUpdateProfile(data);
      }
    } catch (e) {
      enqueueSnackbar("Error, can not get your profile", { variant: SnackBarVariant.Error });
      console.log(e);
    } finally {
      setIsPending(false);
    }
  }
  const handleNameChange = (event) => {
    setName(event.target.value);
  }

  const handleIntroductionChange = (event) => {
    setIntroduction(event.target.value);
  }

  const  handleUpdateButtonClick = async () => {
    setNameFieldError(false);
    setIntroductionFieldError(false);
    if (!introduction || introduction.length === 0) {
      setIntroductionFieldError(true);
      return;
    }
    if (!name || name.length === 0) {
      setNameFieldError(true);
      return;
    }
    try {
      setIsUpdating(true);
      const body = {};
      body['name'] = name;
      body['introduction'] = introduction;
      const res = await updateMyProfile(body);
      switch (res.status) {
        case 200:
          enqueueSnackbar("Update successfully", { variant: SnackBarVariant.Success });
          handleUpdateProfile(res.data);
          break;
        default:
          enqueueSnackbar("Update failed", { variant: SnackBarVariant.Error });
      }
    } catch (e) {

    } finally {
      setIsUpdating(false);
    }
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
            <Box className={classes.formTitle}>Your profile</Box>
          </div>


          <FormControl variant='outlined'
            fullWidth
            className={classes.margin}
          >
            <TextField
            fullWidth
              variant='outlined'
              id="introduction"
              type='text'
              label='Introduction'
              onChange={handleIntroductionChange}
              value={introduction}
              startAdornment={
                <InputAdornment position="start">
                  <InfoIcon />
                </InputAdornment>
              }
              error={introductionFieldError}
              multiline
              rows={10}
              rowsMax={10}
            />
          </FormControl>
          <FormControl variant='outlined'
            fullWidth
            className={classes.margin}
          >
            <TextField
              id="fullname"
              variant='outlined'
              label='Your name'
              onChange={handleNameChange}
              value={name}
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
              error={nameFieldError}
            />
          </FormControl>



       
        </Paper>
        <Grid style={{ marginTop: 10 }} container justify="flex-end">
        <div>
            <Box>
                  <CustomPrimaryContainedButton
                    onClick={handleUpdateButtonClick}
                    variant="contained"
                    disabled={isUpdating}
                    color="primary">
                    Save changes
                  </CustomPrimaryContainedButton>
            </Box>
          </div>
          </Grid>
      </Grid>
    </Grid>

  </div>
}

