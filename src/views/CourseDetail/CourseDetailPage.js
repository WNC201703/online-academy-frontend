import React, {useContext, useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import grey from "@material-ui/core/colors/grey";
import Box from "@material-ui/core/Box";
import Rating from "@material-ui/lab/Rating";
import {useHistory, useParams} from "react-router-dom";
import {getCourseById} from "../../config/api/Courses";
import {SnackBarVariant} from "../../utils/constant";
import {dateFormat, discountFormat, moneyFormat, ratingNumberFormat} from "../../utils/FormatHelper";
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import {Image} from "semantic-ui-react";
import {enrollCourse, getAllLessons, getRelatedCourse} from "../../config/api/Lessons";
import {CourseInfoLoading, DescriptionLoading, LessonsLoading, RelatedCourseLoading} from "../../components/Loading";
import HorizontalCarousel from "../Homepage/HorizontalCarousel";
import CustomFavouriteOutlinedButton from "../../components/Button/CustomFavouriteOutlinedButton";
import CustomFavouriteContainedButton from "../../components/Button/CustomFavouriteContainedButton";
import {addFavouriteCourse, getFavouriteCourse, getMyCourses, removeFavouriteCourse} from "../../config/api/User";
import AuthUserContext from "../../contexts/user/AuthUserContext";
import VisibilityIcon from '@material-ui/icons/Visibility';
import SubscriptionsOutlinedIcon from '@material-ui/icons/SubscriptionsOutlined';
import CustomEnrollOutlinedButton from "../../components/Button/CustomEnrollOutlinedButton";
import CustomViewContainedButton from "../../components/Button/CustomViewContainedButton";

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
  const history = useHistory();
  const {user} = useContext(AuthUserContext);
  const {id} = useParams();
  const {enqueueSnackbar} = useSnackbar();
  const [courseInfo, setCourseInfo] = useState({});
  const [courseLessons, setCourseLessons] = useState([])
  const [relatedCourses, setRelatedCourses] = useState([])
  const [isPending, setIsPending] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEndrolled, setIsEndrolled] = useState(false);

  useEffect(() => {
    const eff = async () => {
      await fetchCourseDetail();
    }
    eff();
  }, [id]);

  const handleFavouriteButtonClick = async () => {
    setIsProcessing(true);
    const res = await addFavouriteCourse(courseInfo._id);
    if (res.status === 200) {
      setIsFavourite(true);
      enqueueSnackbar("Add favourite course successfully", {variant: SnackBarVariant.Success});
    } else {
      enqueueSnackbar("Can not add this course to favourite", {variant: SnackBarVariant.Error});
    }
    setIsProcessing(false)
  }

  const handleRemoveFavouriteCourse = async () => {
    setIsProcessing(true);
    const res = await removeFavouriteCourse(courseInfo._id);
    if (res.status === 204) {
      setIsFavourite(false);
      enqueueSnackbar("Remove favourite course successfully", {variant: SnackBarVariant.Success});
    } else {
      enqueueSnackbar("Can not remove this course from favourite", {variant: SnackBarVariant.Error});
    }
    setIsProcessing(false)
  }

  const handleEnrollCourse = async () => {
    const res = enrollCourse(courseInfo._id)
    if (res.status === 201) {
      setIsEndrolled(true);
      enqueueSnackbar("Enroll this course successfully", {variant: SnackBarVariant.Success});
    } else
      enqueueSnackbar("Failed to enroll this course", {variant: SnackBarVariant.Error});
  }

  const handleViewLessons = async () => {
    history.push(`/courses/${courseInfo._id}/learning`)
  }

  const fetchCourseDetail = async () => {
    setIsPending(true);
    try {
      const [info, lessons, related, favourite, mine] = await Promise.all([
        getCourseById(id), getAllLessons(id), getRelatedCourse(id), getFavouriteCourse(user._id), getMyCourses()
      ]);
      const favouriteIndex = favourite?.data?.findIndex(x => x.course === info?.data?._id);
      const enrolledIndex = mine?.data?.findIndex(x => x.course === info?.data?._id);

      if (!(favouriteIndex < 0)) {
        console.log("run here")
        setIsFavourite(true);
      }
      if (!(enrolledIndex < 0)) setIsEndrolled(true);

      console.log(enrolledIndex);
      setCourseInfo(info.data);
      setCourseLessons(lessons.data);
      setRelatedCourses(related.data);

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
                  <span
                    className={classes.discountMoney}>{moneyFormat(discountFormat(courseInfo?.price, courseInfo?.percentDiscount))}</span></Box>
                <Box className={classes.courseDescription}>{courseInfo.teacher}</Box>
                <Box className={classes.courseDescription}>
                  Last updated: {dateFormat(courseInfo.updatedAt)}
                </Box>
                <Box className={classes.courseDescription} direction='column'>
                  {
                    isFavourite ? <CustomFavouriteContainedButton
                        size="large"
                        style={{marginRight: 12}}
                        onClick={handleRemoveFavouriteCourse}
                        disabled={isProcessing}
                        startIcon={<FavoriteOutlinedIcon/>}
                      >
                        Your favourite course
                      </CustomFavouriteContainedButton> :
                      <CustomFavouriteOutlinedButton
                        onClick={handleFavouriteButtonClick}
                        size="large"
                        style={{marginRight: 12}}
                        startIcon={<FavoriteBorderOutlinedIcon/>}
                      >
                        Add to favourite
                      </CustomFavouriteOutlinedButton>
                  }

                  {
                    isEndrolled ? <CustomViewContainedButton
                        size="large"
                        onClick={handleViewLessons}
                        disabled={isProcessing}
                        startIcon={<VisibilityIcon/>}
                      >
                        View lessons
                      </CustomViewContainedButton> :
                      <CustomEnrollOutlinedButton
                        onClick={handleEnrollCourse}
                        size="large"
                        startIcon={<SubscriptionsOutlinedIcon/>}
                      >
                        Enroll this course
                      </CustomEnrollOutlinedButton>
                  }

                </Box>
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
            isPending ? <DescriptionLoading/> : <Box>{courseInfo.detailDescription}</Box>
          }
        </Paper>
        <Paper className={classes.paper}>
          <Box className={classes.blockTitle}>Course Content</Box>
          <Box> {courseLessons?.length} lessons</Box>
          {
            isPending ? <LessonsLoading/> :
              courseLessons?.map(item => {
                return <Box className={classes.listItem}>{item.lessonNumber} - {item.name}</Box>
              }) || 0
          }
        </Paper>
        <Paper className={classes.paper}>
          {
            isPending ? <RelatedCourseLoading/> : <HorizontalCarousel title="Related Courses" data={relatedCourses}/>
          }
        </Paper>
        <Paper className={classes.paper}>
          <Box className={classes.blockTitle}>Ratings</Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={2}/>
    </Grid>
  </div>
}
