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
import {  Typography } from "@material-ui/core";

import '../../../node_modules/video-react/dist/video-react.css';
import Box from "@material-ui/core/Box";
import PropTypes from 'prop-types';

export default function TabPanel(props) {

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