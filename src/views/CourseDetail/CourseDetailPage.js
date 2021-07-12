import React, {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {blue} from "@material-ui/core/colors";
import grey from "@material-ui/core/colors/grey";
import Box from "@material-ui/core/Box";
import Rating from "@material-ui/lab/Rating";
import {useParams} from "react-router-dom";
import {getCourseById, getNewestCourses, getTopViewedCourses} from "../../config/api/Courses";
import {SnackBarVariant} from "../../utils/constant";
import {moneyFormat, ratingNumberFormat} from "../../utils/FormatHelper";
import Skeleton from "@material-ui/lab/Skeleton";
import {Image} from "semantic-ui-react";
import {getAllLessons} from "../../config/api/Lessons";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    marginTop: 12
  },
  cover: {
    background: grey[800],
    padding: 24,
    color: "white",
  },
  courseTitle: {
    marginTop: 18,
    fontSize: 26,
    fontWeight: "bold",
  },
  courseDescription: {
    fontSize: 18,
    fontWeight: "800%",
  },
  rateText: {
    color: "#ffc107",
    fontWeight: "bold",
    marginRight: 12
  },
  loading: {
    color: grey[100],
    background: "transparent"
  },
  blockTitle: {
    fontWeight: "bold",
    fontSize: 26,
  },
  discountMoney: {
    textDecoration: "line-through",
    fontWeight: "normal",
    marginLeft: 24,
    fontSize: 20
  },
  originMoney: {
    fontWeight: "bold",
    fontSize: 20
  },
  listItem: {
    padding: 8,
    border: 1,
    borderColor: grey[500],
    borderStyle: "solid",
    fontWeight: "bold"
  }
}));
export const CourseDetail = () => {
  const classes = useStyles();
  const {id} = useParams();
  const {enqueueSnackbar} = useSnackbar();
  const [courseInfo, setCourseInfo] = useState({});
  const [courseLessons, setCourseLessons] = useState([])

  const [isPending, setIsPending] = useState(false);

  const CourseInfoLoading = () => {
    return (
      <Box>
        <Box className={classes.loading}><Skeleton width="100%" height={250} animation="wave"/></Box>
        <Box className={classes.loading}><Skeleton width={250} height={100} animation="wave"/></Box>
        <Box className={classes.loading}><Skeleton animation="wave"/></Box>
        <Box className={classes.loading}><Skeleton animation="wave"/></Box>
        <Box className={classes.loading}><Skeleton width={250} animation="wave"/></Box>
      </Box>)
  }

  const DescriptionLoading = () => {
    return (
      <Box>
        <Box className={classes.loading}><Skeleton width="100%" height={250} animation="wave"/></Box>
      </Box>)
  }
  const LessonsLoading = () => {
    return (
      <Box>
        
        <Box className={classes.loading}><Skeleton height={30} animation="wave"/></Box>
        <Box className={classes.loading}><Skeleton height={25} animation="wave"/></Box>
        <Box className={classes.loading}><Skeleton height={25} animation="wave"/></Box>
        <Box className={classes.loading}><Skeleton height={25} animation="wave"/></Box>
        <Box className={classes.loading}><Skeleton height={25} animation="wave"/></Box>
        <Box className={classes.loading}><Skeleton height={25} animation="wave"/></Box>
        <Box className={classes.loading}><Skeleton height={25} animation="wave"/></Box>
      </Box>)
  }

  useEffect(() => {
    const eff = async () => {
      await fetchCourseDetail();
    }
    eff();
  }, []);

  const fetchCourseDetail = async () => {
    setIsPending(true);
    try {
      const [info, lessons] = await Promise.all([
        getCourseById(id), getAllLessons(id)
      ]);
      console.log(lessons.data);
      setCourseInfo(info.data);
      setCourseLessons(lessons.data);
    } catch (e) {
      enqueueSnackbar("Error, can not get course list", {variant: SnackBarVariant.Error});
      console.log(e);
    } finally {
      setIsPending(false);
    }
  }

  return <div className={classes.root}>
    <Grid container spacing={3}>
      <Grid className={classes.cover} container xs={12}>
        <Grid item xs={12} sm={2}/>
        <Grid item xs={12} sm={8}>
          {
            isPending ? <CourseInfoLoading/> : (<Box direction={"row"}>
                <Image
                  draggable={false}
                  style={{width: "100%", height: 350, borderRadius: 12}}
                  src={courseInfo?.imageUrl}
                />
                <Box className={classes.courseTitle}>{courseInfo.name}</Box>
                <Box className={classes.courseDescription}>{courseInfo.shortDescription}</Box>
                <Box className={classes.courseDescription} display="flex" alignItems="center"
                     justify="center">
                  <span className={classes.rateText}>{ratingNumberFormat(courseInfo.averageRating)}</span>
                  <Rating name="read-only" value={ratingNumberFormat(courseInfo.averageRating)} readOnly/>
                  <span>({courseInfo.numberOfReviews}) Ratings</span>
                </Box>
                <Box className={classes.originMoney}>{moneyFormat(courseInfo?.price)}
                  <span className={classes.discountMoney}>{moneyFormat(120)}</span></Box>
                <Box className={classes.courseDescription}>{courseInfo.teacher}</Box>
              </Box>
            )
          }

        </Grid>
        <Grid item xs={12} sm={2}/>
      </Grid>
      <Grid item xs={12} sm={2}/>
      <Grid item xs={12} sm={8}>
        <Paper className={classes.paper}>
          <Box className={classes.blockTitle}>Description</Box>
          {
            isPending ? <DescriptionLoading/> :
              <Box>{courseInfo.detailDescription}</Box>

          }


        </Paper>
        <Paper className={classes.paper}>
          <Box className={classes.blockTitle}>Course Content</Box>
          <Box> {courseLessons?.length} lessons</Box>
          {
            isPending ? <LessonsLoading/> :
              courseLessons.map(item => {
                return <Box className={classes.listItem}>{item.lessonNumber} - {item.name}</Box>
              })
          }
        </Paper>
        <Paper className={classes.paper}>
          <Box className={classes.blockTitle}>Related Courses</Box>
        </Paper>
        <Paper className={classes.paper}>
          <Box className={classes.blockTitle}>Ratings</Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={2}/>
    </Grid>
  </div>
}
