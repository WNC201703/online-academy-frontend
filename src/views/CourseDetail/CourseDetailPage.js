import React, {useContext, useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import grey from "@material-ui/core/colors/grey";
import Box from "@material-ui/core/Box";
import Rating from "@material-ui/lab/Rating";
import {useParams} from "react-router-dom";
import {getCourseById} from "../../config/api/Courses";
import {SnackBarVariant} from "../../utils/constant";
import {moneyFormat, ratingNumberFormat} from "../../utils/FormatHelper";
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import {Image} from "semantic-ui-react";
import {getAllLessons, getRelatedCourse} from "../../config/api/Lessons";
import {CourseInfoLoading, DescriptionLoading, LessonsLoading, RelatedCourseLoading} from "../../components/Loading";
import HorizontalCarousel from "../Homepage/HorizontalCarousel";
import CustomFavouriteOutlinedButton from "../../components/Button/CustomFavouriteOutlinedButton";
import CustomFavouriteContainedButton from "../../components/Button/CustomFavouriteContainedButton";
import {addFavouriteCourse, getFavouriteCourse, removeFavouriteCourse} from "../../config/api/User";
import AuthUserContext from "../../contexts/user/AuthUserContext";
import CustomPrimaryContainedButton from "../../components/Button/CustomPrimaryContainedButton";


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
  const {user} = useContext(AuthUserContext);
  console.log(user);
  const {id} = useParams();
  const {enqueueSnackbar} = useSnackbar();
  const [courseInfo, setCourseInfo] = useState({});
  const [courseLessons, setCourseLessons] = useState([])
  const [relatedCourses, setRelatedCourses] = useState([])

  const [isPending, setIsPending] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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


  const fetchCourseDetail = async () => {
    setIsPending(true);
    try {
      const [info, lessons, related, favourite] = await Promise.all([
        getCourseById(id), getAllLessons(id), getRelatedCourse(id), getFavouriteCourse(user._id)
      ]);
      const favouriteIndex = favourite?.data?.findIndex(x => x._id === info?.data?._id);
      if (!(favouriteIndex < 0)) setIsFavourite(true);
      console.log(favourite.data);
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
                  <span className={classes.discountMoney}>{moneyFormat(120)}</span></Box>
                <Box className={classes.courseDescription}>{courseInfo.teacher}</Box>
                <Box className={classes.courseDescription} direction='column'>
                  {
                    isFavourite ? <CustomFavouriteContainedButton
                        size="large"
                        onClick={handleRemoveFavouriteCourse}
                        disabled={isProcessing}
                        startIcon={<FavoriteOutlinedIcon/>}
                      >
                        Your favourite course
                      </CustomFavouriteContainedButton> :
                      <CustomFavouriteOutlinedButton
                        onClick={handleFavouriteButtonClick}
                        size="large"
                        startIcon={<FavoriteBorderOutlinedIcon/>}
                      >
                        Add to favourite
                      </CustomFavouriteOutlinedButton>
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
