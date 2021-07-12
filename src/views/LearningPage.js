import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { PlayCircleFilled } from '@material-ui/icons';
import { useSnackbar } from "notistack";
import { SnackBarVariant } from "../utils/constant";
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { getAllLessons } from "../config/api/Lessons";
import ReactPlayer from 'react-player'

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
    flexDirection: "row",
  },
  icon: {
    marginRight: 10
  },
  playerWrapper: {
    position: 'relative',
    paddingTop: '56.25%' /* 720 / 1280 = 0.5625 */
  },
  reactPlayer :{
    position: 'absolute',
  }
}));

function TabPanel(props) {

  const { children, value, index, url,...other } = props;
 const classes = useStyles();
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box m={5} >
          <div >
          <ReactPlayer
            url={url}
          className={classes.reactPlayer}
          width="70%"
          height="70%"
            controls={false}
          />
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
  url: PropTypes.any.isRequired
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
                icon={<PlayCircleFilled color="primary" className={classes.icon} />}
                label={`${item.lessonNumber}.${item.name}`}    {...a11yProps(item._id)} />
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
              url={item.videoUrl}
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
