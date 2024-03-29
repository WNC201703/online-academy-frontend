import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import React, { useEffect, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import { Label } from "semantic-ui-react";
import ReactQuill from "react-quill";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import Button from "@material-ui/core/Button";
import CustomPrimaryContainedButton from "../../../components/Button/CustomPrimaryContainedButton";
import { deleteCategory, getAllCategories } from "../../../config/api/Categories";
import { getCourseById, updateCourse, updateCourseImage } from "../../../config/api/Courses";
import { useSnackbar } from "notistack";
import { SnackBarVariant } from "../../../utils/constant";
import { useParams } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from "@material-ui/core/MenuItem";
import { addLesson, getAllLessons, updateLesson, updateLessonVideo } from "../../../config/api/Lessons";
import {
  Accordion
} from 'react-bootstrap';
import Card from "react-bootstrap/Card";
import { TextFields } from "@material-ui/icons";
import VideoPanel from "../../Learning/VideoPanel";
import { Player } from "video-react";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  buttonText: {
    color: 'white'
  },
  textFieldLabelText: {
    color: 'grey',
    fontSize:12,
    paddingTop:15
  }
}));
export const CourseDetailTeacher = () => {
  const classes = useStyles();
  const { id } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const [imagePreview, setImagePreview] = useState(null);

  const [courseName, setCourseName] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [courseShortDescription, setCourseShortDescription] = useState('');
  const [courseFullDescription, setCourseFullDescription] = useState('')
  const [courseImage, setCourseImage] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [courseCategory, setCourseCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [lessons, setLessons] = useState([])
  const [videoPreview, setVideoPreview] = useState(null);
  const [open, setOpen] = useState(false);
  const [lessonName, setLessonName] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [video, setVideo] = useState(null);
  useEffect(() => {
    const eff = async () => {
      await fetchCourseDetail();
    }
    eff();
  }, [id]);

  const handleCourseNameChange = (event) => {
    setCourseName(event.target.value);
  }

  const handleCoursePriceChange = (event) => {
    setCoursePrice(event.target.value)
  }

  const handleCourseShortDescriptionChange = (event) => {
    setCourseShortDescription(event.target.value)
  }

  const handleCourseFullDescriptionChange = (value) => {
    setCourseFullDescription(value)
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    setCourseImage(event.target.files[0])
  }

  const onVideoChange = (event, lessonId) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setVideo(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);

    }
    setVideoPreview(event.target.files[0])

  }
  const handleDeleteCourse = async () => {
    const res = deleteCategory(id)
    if (res.status === 200) {
      enqueueSnackbar("Delete course successfully", { variant: SnackBarVariant.Success });
    }
  }

  const handleUpdateCourse = async () => {
    const data = {
      category: courseCategory,
      name: courseName,
      shortDescription: courseShortDescription,
      detailDescription: courseFullDescription,
      price: coursePrice,
    }
    const res = await updateCourse(id, data)
    if (res.status === 200) {
      window.location.reload();
      enqueueSnackbar("Update course successfully", { variant: SnackBarVariant.Success });
    } else
      enqueueSnackbar("Update course failed", { variant: SnackBarVariant.Error });
  }

  const handleUpdateCourseImage = async () => {
    let formData = new FormData();
    formData.append('image', courseImage);
    const res = await updateCourseImage(id, formData);
    if (res.status === 201) {
      window.location.reload();
      enqueueSnackbar("Update image successfully", { variant: SnackBarVariant.Success });
    } else
      enqueueSnackbar("Update course failed", { variant: SnackBarVariant.Error });
  }

  const fetchCourseDetail = async () => {
    setIsPending(true);
    try {
      const info = await getCourseById(id);
      if (info.status !== 200) {
        return;
      }
      let response = await getAllCategories()
      let res = await getAllLessons(id)
      setLessons(res?.data)
      setCategories(response?.data)
      setCoursePrice(info.data?.price)
      setCourseName(info.data?.name)
      setCourseShortDescription(info.data?.shortDescription)
      setCourseFullDescription(info.data.detailDescription)
      setCourseCategory(info?.data?.categoryId)
      setImagePreview(info?.data?.imageUrl)
    } catch (e) {
      enqueueSnackbar("Error, can not get course list", { variant: SnackBarVariant.Error });
      console.log(e);
    } finally {
      setIsPending(false);
    }
  }

  const handleCategoryChange = (event) => {
    setCourseCategory(event.target.value)
  }

  const handleUpdateLessonVideo = async lessonId => {
    let formData = new FormData();
    formData.append('video', videoPreview);
    const res = await updateLessonVideo(id, formData, lessonId);
    if (res.status === 201) {
      window.location.reload();
      enqueueSnackbar('Update lesson video successfully', { variant: SnackBarVariant.Success })
    } else {
      enqueueSnackbar('Update lesson video failed', { variant: SnackBarVariant.Error })
    }

  }

  const handleUpdateLessonInfo = async (event, payload) => {
    let data = {
      description: payload?.description
    };
    console.log(payload);
    console.log(data);
    const res = await updateLesson(id, data, payload?._id)
    if (res.status === 201) {
      window.location.reload();
      enqueueSnackbar('Update lesson description successfully', { variant: SnackBarVariant.Success })
    } else {
      enqueueSnackbar('Update lesson description failed', { variant: SnackBarVariant.Error })

    }
  }

  const handleCreateLesson = async () => {
    const data = {
      name: lessonName,
      description: lessonDescription
    }
    const res = await addLesson(id, data)
    if (res.status === 201) {
      window.location.reload();
      enqueueSnackbar('Add lesson successfully', { variant: SnackBarVariant.Success })
    } else {
      enqueueSnackbar('Add lesson description failed', { variant: SnackBarVariant.Error })
    }
    handleDialogClose()
  }

  const handleDialogOpen = () => {
    setOpen(true);
  }

  const handleDialogClose = () => {
    setOpen(false);
    setLessonName('')
    setLessonDescription('')
  }

  const handleLessonDescriptionChange = (event, lessonId) => {
    let lessonsList = [...lessons]
    let lesson = lessonsList.find(item => item?._id === lessonId);
    lesson.description = event.target.value;
    setLessons(lessonsList)
  }

  const handleNewLessonDescriptionChange = (event) => {
    setLessonDescription(event.target.value)
  }

  const handleNewLessonNameChange = (event) => {
    setLessonName(event.target.value)
  }

  return <div className={classes.root}>
    <Grid container spacing={3}>
      <Grid className={classes.cover} container xs={12}>
        <Grid item xs={12} sm={2} />
        <Grid item xs={12} sm={8}>


          <Dialog open={open} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create new lesson</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter information to create a new lesson
              </DialogContentText>
              <Label fullWidth>Lesson Name </Label>
              <TextField
                fullWidth
                onChange={handleNewLessonNameChange}
                autoFocus
                margin="dense"
                id="name"
                type="email"
                value={lessonName}
              />
              <Label fullWidth>Lesson Description </Label>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                onChange={handleNewLessonDescriptionChange}
                type="text"
                fullWidth
                value={lessonDescription}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleCreateLesson} color="primary">
                Create
              </Button>
            </DialogActions>
          </Dialog>


          {
            isPending ? <CircularProgress /> :

              <Box>
                <Label className={classes.textFieldLabelText} fullWidth>Course Name </Label>
                <TextField
                  fullWidth
                  onChange={handleCourseNameChange}
                  margin="dense"
                  id="name"
                  type="email"
                  value={courseName}
                />
                <Label className={classes.textFieldLabelText} fullWidth>Price </Label>
                <TextField
                  margin="dense"
                  id="name"
                  onChange={handleCoursePriceChange}
                  type="number"
                  fullWidth
                  value={coursePrice}
                />
                <Label className={classes.textFieldLabelText} fullWidth>Short Description </Label>
                <TextField
                  margin="dense"
                  id="name"
                  onChange={handleCourseShortDescriptionChange}
                  type="email"
                  fullWidth
                  value={courseShortDescription}
                />
                  <Label  className={classes.textFieldLabelText} fullWidth>Category </Label>
                <TextField
                  id="standard-select-currency"
                  select
                  fullWidth
                  value={courseCategory}
                  onChange={handleCategoryChange}
                  >
                  {categories.map((option) => {
                    if (option.children) {
                      let cps = [];
                      cps.push((<MenuItem disabled key={option._id} value={option._id}>
                        {option.name}
                      </MenuItem>));
                      cps.push(option.children.map(
                        (subItem) => ((<MenuItem key={subItem._id} value={subItem._id}>
                          {subItem.name}
                        </MenuItem>))));
                      return cps;
                    }

                  })}
                </TextField>
                <Label className={classes.textFieldLabelText} fullWidth>Full Description </Label>
                <Box fullWidth height={350}>
                  <ReactQuill style={{ height: 300 }} onChange={handleCourseFullDescriptionChange}
                    value={courseFullDescription || ''} />
                </Box>


                <Label className={classes.textFieldLabelText} fullWidth>Course Cover</Label>
                <img style={{ height: 300, width: 300 }} id="target" src={imagePreview} />

                <input type="file" onChange={onImageChange} className="filetype" id="group_image" />
                <Button
                  variant="contained"
                  color="default"
                  onClick={handleUpdateCourseImage}
                  className={classes.button}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload
                </Button>
                <Box style={{ marginBottom: 64 }}>
                  <Button onClick={handleDeleteCourse} style={{ marginRight: 24 }} variant="contained" color="secondary">
                    Delete
                  </Button>
                  <CustomPrimaryContainedButton onClick={handleUpdateCourse} className={classes.buttonText}>
                    Update
                  </CustomPrimaryContainedButton>
                </Box>

                <Box fullWidth>
                  <Label>Lessons</Label>
                  <CustomPrimaryContainedButton onClick={handleDialogOpen} className={classes.buttonText}>
                    Add lesson
                  </CustomPrimaryContainedButton>
                </Box>
                {
                  isPending ? <CircularProgress /> :
                    <div style={{ marginBottom: 64 }}>
                      <Accordion>
                        {
                          lessons?.map((item, index) => <Card>
                            <Card.Header fullwidth>
                              <Accordion.Toggle as={Button}
                                variant="link" eventKey={index + 1}>
                                #{item?.lessonNumber} - {item?.name}
                              </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey={index + 1} onEntered={() => setVideoPreview(null)}>
                              <Card.Body>
                                <TextField
                                  fullWidth
                                  onChange={(event) =>
                                    handleLessonDescriptionChange(event, item?._id)}
                                  autoFocus
                                  margin="dense"
                                  id="name"
                                  type="email"
                                  value={item?.description}
                                />
                                <CustomPrimaryContainedButton onClick={(e) => handleUpdateLessonInfo(e, item)}
                                  className={classes.buttonText}>
                                  Update info
                                </CustomPrimaryContainedButton>

                                <Player
                                  playsInline
                                  fluid={false}
                                  width={768} height={432}
                                  src={item?.videoUrl}></Player>
                                <label>Preview video</label>
                                <Player
                                  playsInline
                                  fluid={false}
                                  width={250} height={250}
                                  src={video}></Player>

                                <input type="file" onChange={(event) => onVideoChange(event, item?._id)}
                                  className="filetype" id="group_image" />

                                <Button
                                  variant="contained"
                                  color="default"
                                  onClick={() => handleUpdateLessonVideo(item?._id)}
                                  className={classes.button}
                                  startIcon={<CloudUploadIcon />}>
                                  Upload video
                                </Button>
                              </Card.Body>
                            </Accordion.Collapse>
                          </Card>)
                        }
                      </Accordion>
                    </div>
                }


              </Box>
          }
        </Grid>
        <Grid item xs={12} sm={2} />
      </Grid>
    </Grid>
  </div>
}