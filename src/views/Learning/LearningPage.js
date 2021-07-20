import React, { useEffect, useState } from "react";
import {
  Redirect,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Checkbox from '@material-ui/core/Checkbox';
import { useSnackbar } from "notistack";
import { SnackBarVariant } from "../../utils/constant";
import { getAllLessons, completedLesson, deleteCompletedLesson } from "../../config/api/Lessons";
import { getCourseById } from "../../config/api/Courses";
import VideoPanel from './VideoPanel'
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 500,
  },
  courseName: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#77d2fc',
    fontSize: 20,
    fontWeight: 'bold'
  },
  leftPanel: {
    backgroundColor: '#f7f7f7',
    position: 'relative',
    overflow: 'auto',
    width: '100%',
    height: 700,
    maxHeight: 700,
  },
  activeItem: {
    backgroundColor: '#e8e8e8',
    color: '#000000  ',
  },
  inactiveItem: {
    color: '#8f8f8f',
  }
}));

export default function LearningPage() {
  const classes = useStyles();
  const { courseId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [pending, setPending] = useState(true);
  const [courseName, setCourseName] = useState('');
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState();
  const [authorized, setAuthorized] = useState(false);

  let { path, url } = useRouteMatch();

  const fetchData = async () => {
    try {
      const [lessonsResponse, courseResponse] = await Promise.all([
        getAllLessons(courseId),
        getCourseById(courseId)
      ]);
      // const response = await getAllLessons(courseId);
      if (lessonsResponse.status === 200) {
        const data = lessonsResponse.data;
        setLessons(data);
        if (data.length > 0) {
          setSelectedLesson(data[0]);
        }
        setAuthorized(true);
      } else {
        if (lessonsResponse==='Forbidden' || lessonsResponse==='Unauthorized'){

        }else{
        enqueueSnackbar(`Error`, { variant: SnackBarVariant.Error });
        }
      }

      if (courseResponse.status === 200) {
        const data = courseResponse.data;
        setCourseName(data.name);
      } else {
        enqueueSnackbar("Error", { variant: SnackBarVariant.Error });
      }

    } catch (e) {
      enqueueSnackbar("Error", { variant: SnackBarVariant.Error });
      console.log(e);
    } finally {
      setPending(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleCheckBoxChange(item) {
    const current = item.completed;
    console.log(current)
    item.completed = !current;
    if (!current)
      completedLesson(courseId, item._id);
    else
      deleteCompletedLesson(courseId, item._id);
    setLessons([...lessons]);
  }

  function handleItemClicked(item) {
    setSelectedLesson(item);
  }

  function handleVideoEnded(item) {
    item.completed = true;
    completedLesson(courseId, item._id);
    setLessons([...lessons]);
  }

  if (!authorized){
    return <Redirect to={{ pathname: `/courses/${courseId}` }} />
  }
  return (
    <div>
      {
        selectedLesson ? <Redirect to={{ pathname: `${url}/${selectedLesson._id}` }} /> : <></>
      }
      {
        pending ? <Grid container justify="center">
          <CircularProgress />
        </Grid> : (
          <Grid container >
            <Grid item xs={12} sm={12}>
              <Typography className={classes.courseName}>{courseName} </Typography>
            </Grid>
            <Grid item xs={12} sm={3} className={classes.leftPanel} >
              <List component="nav" aria-label="video menu">
                {
                  lessons ?
                    lessons.map(
                      (item) =>
                      (
                        <ListItem component={Link} to={`${url}/${item._id}`} button className={item === selectedLesson ? classes.activeItem : classes.inactiveItem}
                          onClick={() => { handleItemClicked(item) }}
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={item.completed}
                              tabIndex={-1}
                              onClick={() => { handleCheckBoxChange(item) }}
                              color='primary'
                              disableRipple
                              inputProps={{ 'aria-labelledby': 'my check box' }}
                            />
                          </ListItemIcon>
                          <ListItemText primary={`${item.lessonNumber}.  ${item.name}`} />
                        </ListItem>
                      )
                    ) :
                    <div></div>
                }
              </List>
            </Grid>

            <Grid item xs={12} sm={9}>
              <VideoPanel
                onVideoEnded={handleVideoEnded}
                lesson={selectedLesson}
              >
                {selectedLesson?.name}
              </VideoPanel>
            </Grid>
          </Grid>

        )
      }
    </div>
  );
}
