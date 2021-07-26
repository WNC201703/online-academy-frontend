import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import {Label} from "semantic-ui-react";
import ReactQuill from "react-quill";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import CustomPrimaryContainedButton from "../../../components/Button/CustomPrimaryContainedButton";
import {deleteCategory} from "../../../config/api/Categories";
import {updateCourse} from "../../../config/api/Courses";
import {useSnackbar} from "notistack";
import {SnackBarVariant} from "../../../utils/constant";
import {useParams} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  buttonText: {
    color: 'white'
  }
}));
export const CourseDetailTeacher = () => {
  const classes = useStyles();
  const {id} = useParams();

  const {enqueueSnackbar} = useSnackbar();

  const [courseName, setCourseName] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [courseShortDescription, setCourseShortDescription] = useState('');
  const [courseFullDescription, setCourseFullDescription] = useState('')
  const [courseImage, setCourseImage] = useState(null);

  const handleCourseNameChange = (event) => {
    setCourseName(event.target.value);
  }

  const handleCoursePriceChange = (event) => {
    setCoursePrice(event.target.value)
  }

  const handleCourseShortDescriptionChange = (event) => {
    setCourseShortDescription(event.target.value)
  }

  const handleCourseFullDescriptionChange = (event) => {
    setCourseFullDescription(event.target?.value)
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setCourseImage(e.target.result)
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  const handleDeleteCourse = async () => {
    const res = deleteCategory(id)
    if (res.status === 200) {
      enqueueSnackbar("Delete course successfully", {variant: SnackBarVariant.Success});
    }
  }

  const handleUpdateCourse = async () => {
    const data = {}
    const res = updateCourse(id, data)
    if (res.status === 200) {
      enqueueSnackbar("Update course successfully", {variant: SnackBarVariant.Success});

    }
  }

  return <div className={classes.root}>
    <Grid container spacing={3}>
      <Grid className={classes.cover} container xs={12}>
        <Grid item xs={12} sm={2}/>
        <Grid item xs={12} sm={8}>
          <Label fullWidth>Course Name </Label>
          <TextField
            fullWidth
            onChange={handleCourseNameChange}
            autoFocus
            margin="dense"
            id="name"
            type="email"
            value={courseName}
          />
          <Label fullWidth>Price </Label>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            onChange={handleCoursePriceChange}
            type="number"
            fullWidth
            value={coursePrice}
          />
          <Label fullWidth>Short Description </Label>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            onChange={handleCourseShortDescriptionChange}
            type="email"
            fullWidth
            value={courseShortDescription}
          />

          <Label fullWidth>Full Description </Label>
          <Box fullWidth height={350}>
            <ReactQuill style={{height: 300}} onChange={handleCourseFullDescriptionChange}
                        value={courseFullDescription}/>
          </Box>

          <Label fullWidth>Course Cover</Label>
          <img id="target" src={courseImage}/>
          <input type="file" onChange={onImageChange} className="filetype" id="group_image"/>

          <Box style={{marginBottom: 64}}>
            <Button onClick={handleDeleteCourse} style={{marginRight: 24}} variant="contained" color="secondary">
              Delete
            </Button>
            <CustomPrimaryContainedButton onClick={handleUpdateCourse} className={classes.buttonText}>
              Update
            </CustomPrimaryContainedButton>
          </Box>
        </Grid>
        <Grid item xs={12} sm={2}/>
      </Grid>
    </Grid>
  </div>
}