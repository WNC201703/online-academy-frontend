import React from "react";
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
import { Typography } from "@material-ui/core";
import '../../../node_modules/video-react/dist/video-react.css';
import Box from "@material-ui/core/Box";
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

export default function VideoPanel(props) {

    const { lesson, onVideoEnded,...other } = props;
    return (
        <div
            role="tabpanel"
            id={`vertical-tabpanel-${lesson._id}`}
            aria-labelledby={`vertical-tab-${lesson._id}`}
            {...other}
        >
            <Grid>
                <Box m={3} >
                    <div >
                        <Typography variant="h4" component="h2">{lesson.name}</Typography>
                        <Box m={2} />
                        <Grid item xs={9}>
                            <Player
                                onEnded={()=>{onVideoEnded(lesson)}}
                                playsInline
                                fluid={false}
                                width={768} height={432}
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
                        </Grid>
                        <Box m={2} />
                        <Box mr={12} >
                            <Typography variant="h6" >{'Description:'}</Typography>
                            <Typography component="h2">{lesson.description}</Typography>
                        </Box >
                        <Box my={12} />
                    </div>
                </Box>
            </Grid>
        </div>
    );
}

VideoPanel.propTypes = {
    lesson: PropTypes.any.isRequired
};