import React, {useContext, useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import CustomPrimaryContainedButton from "../components/Button/CustomPrimaryContainedButton";
import Box from "@material-ui/core/Box";
import {isValidEmail} from "../utils/ValidationHelper";
import CircularProgress from "@material-ui/core/CircularProgress";
import {getFavouriteCourse, getInfo, signIn, updateUser} from "../config/api/User";
import {LocalKey, SnackBarVariant, UserRoles} from "../utils/constant";
import {useSnackbar} from "notistack";
import {saveAccessToken} from "../utils/LocalStorageUtils";
import AuthUserContext from "../contexts/user/AuthUserContext";
import {useHistory} from "react-router-dom";
import {getCourseById} from "../config/api/Courses";
import {getAllLessons, getRelatedCourse} from "../config/api/Lessons";

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

export const ProfilePage = () => {
  const classes = useStyles();
  const history = useHistory();
  const {user} = useContext(AuthUserContext);
  const {saveUser} = useContext(AuthUserContext);
  const {enqueueSnackbar} = useSnackbar();
  const [isPending, setIsPending] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const eff = async () => {
      await fetchProfile();
    }
    eff();
  }, []);

  const fetchProfile = async () => {
    setIsPending(true);
    try {
      const res = await getInfo();
      if (res.status === 200) {
        setProfile(res.data);
      }
    } catch (e) {
      enqueueSnackbar("Error, can not get course list", {variant: SnackBarVariant.Error});
      console.log(e);
    } finally {
      setIsPending(false);
    }
  }

  const handleNameChange = (event) => {
    const newProfile = {...profile};
    newProfile.fullname = event.target.value
    setProfile(newProfile);
  }

  const handleUpdateButtonClick = async () => {
    setIsPending(true);

    try {
      const res = await updateUser(user._id, profile);
      enqueueSnackbar("Update successfully", {variant: SnackBarVariant.Success});


    } catch (e) {

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
      <Grid item xs={3}>
        <Paper style={{justifyContent: 'center', padding: 48}} className={classes.paper}>
          <Box className={classes.formTitle}>Your profile</Box>
          <Box fontSize={14} style={{marginTop: 24, marginBottom: 24}}>Update your profile here.</Box>
          <TextField fullWidth onChange={handleNameChange} value={profile?.fullname}
                     variant="outlined"/>
          <TextField fullWidth value={profile?.email}
                     disabled
                     style={{marginTop: 24, marginBottom: 24}}
                     variant="outlined"/>
          <Box>
            {
              isPending ? <CircularProgress/> : <CustomPrimaryContainedButton
                onClick={handleUpdateButtonClick}
                variant="contained"
                color="primary">
                Update
              </CustomPrimaryContainedButton>
            }
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </div>
}