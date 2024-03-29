import React, {useEffect, useState} from "react";
import Carousel from "react-bootstrap/Carousel";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import HorizontalCarousel from "./HorizontalCarousel";
import {getNewestCourses, getTopViewedCourses, getPopularCourses, getTopWeek} from "../../config/api/Courses";
import {useSnackbar} from "notistack";
import {SnackBarVariant} from "../../utils/constant";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {getTopCategories} from "../../config/api/Categories";
import {CourseInfoLoading, HomePageLoading, RelatedCourseLoading} from "../../components/Loading";

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
  const [popularCourses, setPopularCourses] = useState([]);
  const [newestCourses, setNewestCourses] = useState([]);
  const [topViewedCourses, setTopViewedCourses] = useState([]);
  const [category, setCategory] = useState([]);
  const [topWeek, setTopWeek] = useState([]);

  useEffect(() => {
    const eff = async () => {
      await fetchCourseList();
    }
    eff();
  }, []);


  const fetchCourseList = async () => {
    setIsPending(true);
    try {
      const [popularList, newestList, topViewedList, topCategory, topOfWeek] = await Promise.all([
        getPopularCourses(),
        getNewestCourses(),
        getTopViewedCourses(),
        getTopCategories(),
        getTopWeek()
      ]);
      setPopularCourses(popularList.data);
      setNewestCourses(newestList.data);
      setTopViewedCourses(topViewedList.data);
      setTopWeek(topOfWeek.data)
      if (topCategory.data?.length > 0) setCategory(topCategory.data)
      else {
        let top = []
        top.push(topCategory.data)
        setCategory(top)
      }
    } catch (e) {
      enqueueSnackbar("Error, can not get course list", {variant: SnackBarVariant.Error});
      console.log(e);
    } finally {
      setIsPending(false);
    }

  }

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  return (
    <Container>
      <Row>
        <Col/>
        <Col xs={9}>
          {
            isPending ? <div className={classes.root}>
                <HomePageLoading/></div>
              : <Carousel activeIndex={index} onSelect={handleSelect}>
                {
                  category.map((item, i) => {
                    return (<Carousel.Item key={i}>
                      <img
                        className="w-100 h-100"
                        src='https://www.apple.com/v/education/home/f/images/overview/college_students__dvn47171w282_medium_2x.jpg'
                        alt="First slide"
                      />
                      <Carousel.Caption>
                        <h3 style={{color: 'white'}}>{item.name}</h3>
                        <p style={{color: 'white'}}>{item.enrollments} - enrollments</p>
                      </Carousel.Caption>
                    </Carousel.Item>)
                  })
                }
              </Carousel>
          }


        </Col>
        <Col/>
      </Row>
      {
        isPending ? <div className={classes.root}>
            <div/>
          </div>
          : <Box direction={"column"}>
            <HorizontalCarousel data={popularCourses} deviceType={"desktop"} title={"Popular courses"}/>
            <HorizontalCarousel data={newestCourses} deviceType={"desktop"} title={"Latest courses"}/>
            <HorizontalCarousel data={topViewedCourses} deviceType={"desktop"} title={"Top viewed"}/>
            <HorizontalCarousel data={topWeek} deviceType={"desktop"} title={"Top of the week"}/>

          </Box>
      }

    </Container>
  );
}