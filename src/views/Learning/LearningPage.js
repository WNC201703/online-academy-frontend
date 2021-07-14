import React, { useEffect, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
// import { CropSquare, CheckBox } from '@material-ui/icons';
import Checkbox from '@material-ui/core/Checkbox';
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import { SnackBarVariant } from "../../utils/constant";
import { getAllLessons, completedLesson, deleteCompletedLesson } from "../../config/api/Lessons";
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
  }
}));


export default function LearningPage() {
  const classes = useStyles();
  const { courseId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [pending, setPending] = useState(true);
  const [videos, setVideos] = useState([]);
  const [videoSelected, setVideoSelected] = useState();

  const fetchData = async () => {
    try {
      const response = await getAllLessons(courseId);
      if (response.status === 200) {
        const data = response.data;
        setVideos(data);
        if (data.length > 0) {
          setVideoSelected(data[0]);
        }
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
    item.completed = !current;
    if (!current)
      completedLesson(courseId, item._id);
    else
      deleteCompletedLesson(courseId, item._id);
    setVideos(videos);
  }

  function handleItemClicked(item) {
    setVideoSelected(item);
  }

  function handleVideoEnded(item) {
    item.completed = true;
    completedLesson(courseId, item._id);
    setVideoSelected(item);
  }

  if (pending) return (
    <Grid container justify="center">
      <CircularProgress />
    </Grid>
  )

  return (
    <Grid container >
      <Grid item xs={12} sm={12}>
        <Typography className={classes.courseName}>React </Typography>
      </Grid>
      <Grid item xs={12} sm={3} className={classes.leftPanel} >
        <List component="nav" aria-label="video menu">
          {
            videos ?
              videos.map(
                (item) =>
                (
                  <ListItem button className={item === videoSelected ? classes.activeItem : ''}
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
          lesson={videoSelected}
        >
          {videoSelected.name}
        </VideoPanel>
      </Grid>
    </Grid>
  );


}
