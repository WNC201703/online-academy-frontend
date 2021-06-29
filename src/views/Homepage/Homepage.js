import React, {useEffect, useState} from "react";
import Carousel from "react-bootstrap/Carousel";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import HorizontalCarousel from "./HorizontalCarousel";
import {getNewestCourses, getTopViewedCourses} from "../../config/api/Courses";
import {useSnackbar} from "notistack";
import {SnackBarVariant} from "../../utils/constant";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
    marginTop: 24,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export const Homepage = () => {
  const classes = useStyles();
  const {enqueueSnackbar} = useSnackbar();
  const [index, setIndex] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [newestCourses, setNewestCourses] = useState([]);
  const [topViewedCourses, setTopViewedCourses] = useState([]);

  useEffect(() => {
    const eff = async () => {
      await fetchCourseList();
    }
    eff();
  }, []);


  const fetchCourseList = async () => {
    setIsPending(true);
    try {
      const [newestList, topViewedList] = await Promise.all([
        getNewestCourses(),
        getTopViewedCourses()
      ]);
      setNewestCourses(newestList.data);
      setTopViewedCourses(topViewedList.data);
    } catch (e) {
      enqueueSnackbar("Error, can not get course list", {variant: SnackBarVariant.Error});
      console.log(e);
    } finally {
      setIsPending(false);
    }

  }

  const sampleArray = [
    {
      title: " Course title 1",
      desc: "Course description"
    },
    {
      title: " Course title 2",
      desc: "Course description 2"
    }, {
      title: " Course title 3",
      desc: "Course description 3"
    },
    {
      title: " Course title 4",
      desc: "Course description 4"
    }
  ]
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  return (
    <Container>
      <Row>
        <Col/>
        <Col xs={9}>
          <Carousel activeIndex={index} onSelect={handleSelect}>
            {
              sampleArray.map((item, i) => {
                return (<Carousel.Item key={i}>
                  <img
                    className="w-100 h-100"
                    src='https://www.apple.com/v/education/home/f/images/overview/college_students__dvn47171w282_medium_2x.jpg'
                    alt="First slide"
                  />
                  <Carousel.Caption>
                    <h3 style={{color: 'white'}}>{item.title}</h3>
                    <p style={{color: 'white'}}>{item.desc}</p>
                  </Carousel.Caption>
                </Carousel.Item>)
              })
            }
          </Carousel>
        </Col>
        <Col/>
      </Row>
      {
        isPending ? <div className={classes.root}>
            <CircularProgress/></div>
          : <Box direction={"column"}>
            <HorizontalCarousel data={newestCourses} deviceType={"desktop"} title={"Latest courses"}/>
            <HorizontalCarousel data={newestCourses} deviceType={"desktop"} title={"Latest courses"}/>
            <HorizontalCarousel data={topViewedCourses} deviceType={"desktop"} title={"Top of the week"}/>
          </Box>
      }

    </Container>
  );
}