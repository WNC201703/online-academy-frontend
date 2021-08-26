import React, { useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import grey from "@material-ui/core/colors/grey";
import Box from "@material-ui/core/Box";
import Rating from "@material-ui/lab/Rating";
import { useHistory, useParams } from "react-router-dom";
import { getCourseById, reviewCourse } from "../../config/api/Courses";
import { getTeacherProfile } from "../../config/api/User";
import { SnackBarVariant } from "../../utils/constant";
import { dateFormat, discountFormat, moneyFormat, ratingNumberFormat } from "../../utils/FormatHelper";
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import { Image, Label } from "semantic-ui-react";
import {
  enrollCourse,
  getCourseReviews,
  getPreviewLessons,
  getRelatedCourse
} from "../../config/api/Lessons";
import { CourseInfoLoading, DescriptionLoading, LessonsLoading, RelatedCourseLoading } from "../../components/Loading";
import HorizontalCarousel from "../Homepage/HorizontalCarousel";
import CustomFavouriteOutlinedButton from "../../components/Button/CustomFavouriteOutlinedButton";
import CustomFavouriteContainedButton from "../../components/Button/CustomFavouriteContainedButton";
import {
  addFavouriteCourse,
  getMyFavouriteCourseByCourseId,
  getMyCourseByCourseId,
  removeFavouriteCourse
} from "../../config/api/User";
import AuthUserContext from "../../contexts/user/AuthUserContext";
import VisibilityIcon from '@material-ui/icons/Visibility';
import SubscriptionsOutlinedIcon from '@material-ui/icons/SubscriptionsOutlined';
import CustomEnrollOutlinedButton from "../../components/Button/CustomEnrollOutlinedButton";
import CustomViewContainedButton from "../../components/Button/CustomViewContainedButton";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import MenuItem from "@material-ui/core/MenuItem";
import ReactQuill from "react-quill";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import { Player } from "video-react";
import CustomPrimaryContainedButton from "../../components/Button/CustomPrimaryContainedButton";
import { Divider, Typography } from "@material-ui/core";

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
  },
  note: {
    fontWeight: "bold"

  },
}));
export const CourseDetail = () => {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthUserContext);
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [courseInfo, setCourseInfo] = useState({});
  const [courseLessons, setCourseLessons] = useState([])
  const [teacherProfile, setTeacherProfile] = useState()
  const [relatedCourses, setRelatedCourses] = useState([])
  const [isPending, setIsPending] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [ratingPoint, setRatingPoint] = useState(1);
  const [ratingContent, setRatingContent] = useState('');
  const [reviewList, setReviewList] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(false);

  const isSignedIn = user != null;
  useEffect(() => {
    const eff = async () => {
      await fetchCourseDetail();
    }
    eff();
  }, [id]);
  const isDiscount = courseInfo?.percentDiscount > 0

  const handleFavouriteButtonClick = async () => {
    setIsProcessing(true);
    const res = await addFavouriteCourse(courseInfo._id);
    if (res.status === 200) {
      setIsFavourite(true);
      enqueueSnackbar("Add favourite course successfully", { variant: SnackBarVariant.Success });
    } else {
      enqueueSnackbar("Can not add this course to favourite", { variant: SnackBarVariant.Error });
    }
    setIsProcessing(false)
  }

  const handleRemoveFavouriteCourse = async () => {
    setIsProcessing(true);
    const res = await removeFavouriteCourse(courseInfo._id);
    if (res.status === 204) {
      setIsFavourite(false);
      enqueueSnackbar("Remove favourite course successfully", { variant: SnackBarVariant.Success });
    } else {
      enqueueSnackbar("Can not remove this course from favourite", { variant: SnackBarVariant.Error });
    }
    setIsProcessing(false)
  }

  const handleEnrollCourse = async () => {
    const res = await enrollCourse(courseInfo._id)
    if (res.status === 201) {
      setIsEnrolled(true);
      enqueueSnackbar("Enroll this course successfully", { variant: SnackBarVariant.Success });
    } else
      enqueueSnackbar("Failed to enroll this course", { variant: SnackBarVariant.Error });
  }

  const handleViewLessons = async () => {
    history.push(`/courses/${courseInfo._id}/learn`)
  }

  const handleRatingBarChange = (event) => {
    setRatingPoint(event.target.value);
  }

  const handleRatingContentChange = (event) => {
    setRatingContent(event.target.value);
  }
  const handleDialogOpen = (e, videoUrl) => {
    setPreviewVideo(videoUrl)
    setOpen(true);
  }
  const handleLoadMoreReview = async () => {
    const nextPage = reviewPage + 1;
    const res = await getCourseReviews(id, 5, nextPage);
    if (res === 200) {
      const nextReviewList = res.data.results;
      const newReviewList = [...reviewList, ...nextReviewList];
      setReviewList(newReviewList);
      setReviewPage(nextPage);
    }
  }

  const fetchCourseDetail = async () => {
    setIsPending(true);
    try {
      const [info, lessons, related,
        reviews] = await Promise.all([
          getCourseById(id), getPreviewLessons(id), getRelatedCourse(id),
          getCourseReviews(id, 10, reviewPage)
        ]);
      let favourite;
      let mine;
      if (user._id) {
        mine = await getMyCourseByCourseId(id);
        favourite = await getMyFavouriteCourseByCourseId(id);
        //not found
        if (favourite.status === 200) setIsFavourite(true);
        else setIsFavourite(false);

        if (mine.status === 200) setIsEnrolled(true);
        else setIsEnrolled(false);
      }

      if (info.status !== 200) {
        return;
      }
      const teacherProfile = await getTeacherProfile(info?.data.teacherId);

      setReviewList(reviews?.data?.results)
      setCourseInfo(info.data);
      setCourseLessons(lessons.data);
      setRelatedCourses(related.data);
      setTeacherProfile(teacherProfile.data);

    } catch (e) {
      enqueueSnackbar("Error, can not get course list", { variant: SnackBarVariant.Error });
      console.log(e);
    } finally {
      setIsPending(false);
    }
  }

  const handleDialogClose = () => {
    setOpen(false);
  }

  const handleRatingCourse = async () => {
    setIsProcessing(true)
    const review = {
      review: ratingContent,
      rating: ratingPoint
    }
    if (!user._id) {
      history.push('/sign-in')
    }
    const res = await reviewCourse(courseInfo._id, review)
    if (res !== 400) {
      enqueueSnackbar("Review course successfully", { variant: SnackBarVariant.Success });
    } else {
      enqueueSnackbar("Failed to review course", { variant: SnackBarVariant.Error });
    }
    setIsProcessing(false)
    setRatingContent('');
    setRatingPoint(1);
  }

  return <div className={classes.root}>
    <Grid container >
      <Grid className={classes.cover} container xs={12}>
        <Grid item xs={12} sm={2} />
        <Grid item xs={12} sm={8}>
          {
            isPending ? <CourseInfoLoading /> : (<Box direction={"row"}>
              <Image
                draggable={false}
                style={{ width: "100%", height: 350, borderRadius: 12 }}
                src={courseInfo?.imageUrl}
              />
              <Box className={classes.courseTitle}>{courseInfo?.name}</Box>
              <Box className={classes.courseDescription}>{courseInfo?.shortDescription}</Box>
              <Box className={classes.courseDescription} display="flex" alignItems="center"
                justify="center">
                <span className={classes.rateText}>{ratingNumberFormat(courseInfo?.averageRating)}</span>
                <Rating name="read-only" value={ratingNumberFormat(courseInfo?.averageRating)} readOnly />
                <span>({courseInfo?.numberOfReviews}) Ratings</span>
              </Box>
              <Box className={classes.originMoney}>{moneyFormat(courseInfo?.price)}
                {
                  isDiscount ? <span
                    className={classes.discountMoney}>{moneyFormat(discountFormat(courseInfo?.price, courseInfo?.percentDiscount))}</span>
                    : <></>
                }
              </Box>
              <Box className={classes.courseDescription}>{courseInfo?.teacher}</Box>
              <Box className={classes.courseDescription}>
                Last updated: {dateFormat(courseInfo?.updatedAt)}
              </Box>
              {
                user._id ? <Box className={classes.courseDescription} direction='column'>
                  {
                    isFavourite ? <CustomFavouriteContainedButton
                      size="large"
                      style={{ marginRight: 12 }}
                      onClick={handleRemoveFavouriteCourse}
                      disabled={isProcessing}
                      startIcon={<FavoriteOutlinedIcon />}
                    >
                      Your favourite course
                    </CustomFavouriteContainedButton> :
                      <CustomFavouriteOutlinedButton
                        onClick={handleFavouriteButtonClick}
                        size="large"
                        style={{ marginRight: 12 }}
                        startIcon={<FavoriteBorderOutlinedIcon />}
                      >
                        Add to favourite
                      </CustomFavouriteOutlinedButton>
                  }

                  {
                    isEnrolled ? <CustomViewContainedButton
                      size="large"
                      onClick={handleViewLessons}
                      disabled={isProcessing}
                      startIcon={<VisibilityIcon />}
                    >
                      View lessons
                    </CustomViewContainedButton> :
                      <CustomEnrollOutlinedButton
                        onClick={handleEnrollCourse}
                        size="large"
                        startIcon={<SubscriptionsOutlinedIcon />}
                      >
                        Enroll this course
                      </CustomEnrollOutlinedButton>
                  }
                </Box> : <div>You should sign in to use this service</div>
              }
            </Box>
            )
          }

        </Grid>
        <Grid item xs={12} sm={2} />
      </Grid>
      <Grid item xs={12} sm={2} />
      <Grid item xs={12} sm={8}>
        <Paper className={classes.paper}>
          <Box className={classes.blockTitle}>Description</Box>
          {
            isPending ? <DescriptionLoading /> : <div dangerouslySetInnerHTML={{ __html: courseInfo?.detailDescription }} />
          }
        </Paper>
        <Paper className={classes.paper}>
          <Box className={classes.blockTitle}>Course Content</Box>
          <Box> {courseLessons?.length} lessons</Box>
          {
            isPending ? <LessonsLoading /> :
              courseLessons?.map(item => {
                const hasPreview = item?.videoUrl != null
                return <Box>
                  <Box className={classes.listItem}>
                    {item.lessonNumber} - {item.name}
                  </Box>
                  {
                    hasPreview ? <CustomPrimaryContainedButton style={{ marginTop: 12, marginBottom: 12 }}
                      onClick={(e) => handleDialogOpen(e, item?.videoUrl)}>
                      Preview
                    </CustomPrimaryContainedButton> : <></>
                  }
                </Box>

              }) || 0
          }

          <Dialog maxWidth open={open} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Preview Lesson</DialogTitle>
            <DialogContent>
              <Player
                playsInline
                fluid={false}
               height={400}
                src={previewVideo}></Player>
            </DialogContent>
            <DialogActions>
            </DialogActions>
          </Dialog>


        </Paper>
        <Paper className={classes.paper}>
          {
            isPending ? <RelatedCourseLoading /> : <HorizontalCarousel title="Related Courses" data={relatedCourses} />
          }
        </Paper>

        {teacherProfile ? <Paper className={classes.paper}>
          <Box className={classes.blockTitle}>Teacher</Box>
          <Typography style={{ fontSize: 30 }} color='primary' component="h3">{teacherProfile.name}</Typography>
          <Box style={{ marginLeft: 12, }}> {`* Rating: ${teacherProfile?.rating? teacherProfile?.rating:'0'} `}</Box>
          <Box style={{ marginLeft: 12 }}>{`* Reviews: ${teacherProfile?.reviews? teacherProfile?.reviews:'0'} `}</Box>
          <Box style={{ marginLeft: 12 }}>{`* Students: ${teacherProfile?.students? teacherProfile?.students:'0'} `} </Box>
          <Box style={{ marginLeft: 12 }}> {`* Courses: ${teacherProfile?.courses? teacherProfile?.courses:'0'} `}</Box>
          <Divider style={{ marginBottom: 10 }} />
          <Typography component="h2">{teacherProfile.introduction}</Typography>
        </Paper> :<div/>}

        <Paper className={classes.paper}>
          <Box className={classes.blockTitle}>Ratings</Box>
          {
            isSignedIn ? <Box direction="column">
              <Box>
                <TextField value={ratingContent} onChange={handleRatingContentChange} fullWidth
                  style={{ marginTop: 12, marginBottom: 12 }}
                  label="Write your review"
                  variant="outlined" />
                <Box className={classes.note}>Note: If you have not seen this course yet, you can not write review</Box>
                <Rating precision={0.5} value={ratingPoint} onChange={handleRatingBarChange} size="large"
                  name="read-only" />
              </Box>
              <Button size="medium"
                height={65}
                color="primary"
                disabled={isProcessing || ratingContent.length < 0 || !isEnrolled}
                onClick={handleRatingCourse}
                variant='contained'>
                Send
              </Button>
              {
                reviewList?.map(item => {
                  if (item.user === user._id) {
                    return <Box style={{ backgroundColor: grey[300] }}>
                      <Box className={classes.note} style={{ marginLeft: 12 }}> {item?.username}</Box>
                      <Box style={{ marginLeft: 12 }}> {item?.review}</Box>
                      <Rating style={{ marginLeft: 10 }} readOnly value={item?.rating} size="medium" />
                    </Box>
                  } else
                    return <Box>
                      <Box className={classes.note} style={{ marginLeft: 12 }}> {item?.username}</Box>
                      <Box style={{ marginLeft: 12 }}> {item?.review}</Box>
                      <Rating style={{ marginLeft: 10 }} readOnly value={item?.rating / 2} precision={0.5} size="medium" />
                    </Box>
                })
              }
              <Box>
                <CustomEnrollOutlinedButton
                  fullwidth
                  onClick={handleLoadMoreReview}
                  size="small"
                  style={{ marginRight: 12, marginLeft: 12, marginTop: 12 }}
                  startIcon={<AddCircleOutlineIcon />}
                >
                  Show more reviews
                </CustomEnrollOutlinedButton> </Box>
            </Box> : <Box>
              You need to sign in to read this content
            </Box>
          }
        </Paper>

      </Grid>
      <Grid item xs={12} sm={2} />
    </Grid>
  </div>
}
