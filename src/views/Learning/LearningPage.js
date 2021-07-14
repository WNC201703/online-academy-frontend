import React, { useEffect, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
// import { CropSquare, CheckBox } from '@material-ui/icons';
import Checkbox from '@material-ui/core/Checkbox';
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import { SnackBarVariant } from "../../utils/constant";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { getAllLessons, completedLessons, deleteCompletedLessons } from "../../config/api/Lessons";
import TabPanel from './TabPanel'
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 700,
  },
  tabs: {
    borderRight: `2px solid ${theme.palette.divider}`,
    minWidth: 280,
    maxWidth: 280,
    display: 'flex',
    alignItems: 'left',
  },
  tab: {
    width: 280,
    textTransform: 'none',
  },
  iconLabelWrapper: {
    // flexDirection: "row",
    alignItems: "flex-start",
  },
  icon: {
    marginRight: 5
  },
  reactPlayer: {
    position: 'absolute',
  }
}));

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function LearningPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { courseId } = useParams();
  const classes = useStyles();
  const [videos, setVideos] = useState([]);
  const [pending, setPending] = useState(true);
  const [value, setValue] = useState(0);

  const fetchVideos = async () => {
    try {
      const response = await getAllLessons(courseId);
      if (response.status === 200) {
        const data = response.data;
        setVideos(data);
        if (data.length > 0) {
          setValue(data[0]._id);
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
    fetchVideos();
  }, []);

  const handleChange = (event, newValue) => {
    if (newValue) setValue(newValue);
  };

  const handleCheckBoxChange = (event, item) => {
    // videos.forEach(element => {
    //   if (element._id===event.target.id){
    //       element.completed=event.target.checked;
    //       if (element._id===value){
    //       }
    //   }
    // });
    // setVideos(videos);
  };


  if (pending) return (
    <Grid container justify="center">
      <CircularProgress />
    </Grid>
  )
  return (
    <div className={classes.root}>
      <Tabs
        variant="scrollable"
        orientation="vertical"
        indicatorColor="primary"
        onChange={handleChange}
        textColor="primary"
        value={value}
        TabIndicatorProps={{
          style: {
            width: "5px",
          }
        }}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        {
          videos ?
            videos.map((item) => (
              <Tab
                key={item._id}
                className={classes.tab}
                classes={{
                  wrapper: classes.iconLabelWrapper,
                }}
                value={item._id}
                label={
                  <div style={{ width: 280, display: 'flex', alignItems: 'center' }}>
                    {
                      <Checkbox
                        checked={item.completed}
                        id={item._id}
                        onChange={handleCheckBoxChange}
                        color="primary"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                      />
                    }
                    {`${item.lessonNumber}. ${item.name}`}
                  </div>

                }

                {...a11yProps(item._id)} />
            ))
            :
            <div></div>
        }

      </Tabs>
      {
        videos ?
          videos.map((item) => (
            <TabPanel
              value={value}
              index={item._id}
              key={item._id}
              lesson={item}
            >
              {item.description}
            </TabPanel>
          ))
          :
          <div></div>
      }
    </div>
  );
}
