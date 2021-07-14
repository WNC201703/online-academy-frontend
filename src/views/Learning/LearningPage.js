import React, { useEffect, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { CropSquare } from '@material-ui/icons';
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import { SnackBarVariant } from "../../utils/constant";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { getAllLessons } from "../../config/api/Lessons";
import TabPanel from './TabPanel'


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
  const [videos, setVideos] = useState();
  const [value, setValue] = useState();

  const fetchVideos = async () => {
    try {
      const response = await getAllLessons(courseId);
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
        variant="scrollable"
        orientation="vertical"
        indicatorColor="primary"
        onChange={handleChange}
        textColor="primary"
        value={value}
        TabIndicatorProps={{
          style: {
            width:"15px",
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
