import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { CheckBox, PlayCircleFilled, CropSquare } from '@material-ui/icons';
import { useSnackbar } from "notistack";
import { SnackBarVariant } from "../utils/constant";
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { getAllLessons } from "../config/api/Lessons";
import '../../node_modules/video-react/dist/video-react.css';

import {
  Player,
  ControlBar,
  ReplayControl,
  ForwardControl,
  CurrentTimeDisplay,
  TimeDivider,
  PlaybackRateMenuButton,
  VolumeMenuButton
} from 'video-react';
import { Divider, Typography } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 700,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    minWidth: 300,
    maxWidth: 300,
    display: 'flex',
    alignItems: 'left',

  },
  tab: {
    textTransform: 'none',
  },
  iconLabelWrapper: {
    // flexDirection: "row",
    alignItems: "flex-start",
  },
  icon: {
    marginRight: 10
  },
  playerWrapper: {
    position: 'relative',
    paddingTop: '56.25%' /* 720 / 1280 = 0.5625 */
  },
  reactPlayer: {
    position: 'absolute',
  }
}));

function TabPanel(props) {

  const { children, value, index, lesson, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box m={3} >
          <div >
            <Typography variant="h4" component="h2">{lesson.name}</Typography>
            <Box m={2} />
            <Player
              onEnded={() => { console.log('end ne bro') }}
              playsInline
              fluid={false} width={768} height={432}
              src={lesson.videoUrl}

            >
              <ControlBar>
                <ReplayControl seconds={10} order={1.1} />
                <ForwardControl seconds={30} order={1.2} />
                <CurrentTimeDisplay order={4.1} />
                <TimeDivider order={4.2} />
                <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
                <VolumeMenuButton disabled />
              </ControlBar>
            </Player>
            <Box m={2} />
            <Box mr={12} >
              <Typography variant="h6" >{'Descriptio:'}</Typography>
              <Typography component="h2">{lesson.description}</Typography>
            </Box >
            <Box my={12} />
          </div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  lesson: PropTypes.any.isRequired
};
function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function LearningPage() {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [videos, setVideos] = useState();
  const [value, setValue] = useState();

  const fetchVideos = async () => {
    try {
      const response = await getAllLessons('60dc3069d034511c68addffa');
      if (response.status === 200) {
        const data = response.data;
        setVideos(data);
        if (data.length > 0) {
          console.log('data 0', data[0]._id);
          setValue(data[0]._id);
        }
      } else {
        enqueueSnackbar("Error", { variant: SnackBarVariant.Error });
      }
    } catch (e) {
      enqueueSnackbar("Error", { variant: SnackBarVariant.Error });
      console.log(e);
    } finally {
    }
  }

  useEffect(() => {
    console.log('fetch data');
    fetchVideos();
  }, [])

  const handleChange = (event, newValue) => {
    if (newValue) setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        indicatorColor="primary"
        onChange={handleChange}
        textColor="primary"

        value={value}
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
                  <div>
                    <CropSquare color="primary" className={classes.icon} />
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
