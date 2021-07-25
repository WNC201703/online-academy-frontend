import React, {useEffect, useState} from "react";
import Box from "@material-ui/core/Box";
import {useSnackbar} from "notistack";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import grey from "@material-ui/core/colors/grey";

import Grid from "@material-ui/core/Grid";
import {useHistory, useLocation, useParams} from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import {getAllCourses, getEnrollmentsCourse, getFavoriteCourses} from "../../../config/api/Courses";
import {getCategoryById} from "../../../config/api/Categories";
import {LineListLoading} from "../../../components/Loading";
import {CourseLineItem} from "../../CourseList/CourseLineItem";
import {SnackBarVariant} from "../../../utils/constant";
import Button from "@material-ui/core/Button";
import CustomPrimaryContainedButton from "../../../components/Button/CustomPrimaryContainedButton";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import {Editor} from "./Edittor";
import ReactQuill from "react-quill";
import {Label} from "semantic-ui-react";


const useStyles = makeStyles((theme) => ({
  itemContainer: {
    '&:hover': {
      backgroundColor: grey[300],
      cursor: "pointer"
    },
    searchContainer: {
      height: 200,
      maxHeight: 200,
    }
  },
  blockTitle: {
    fontWeight: "bold",
    fontSize: 26,
    marginTop: 24
  },
  button: {
    color: 'white',
    marginTop: 24
  }
}));


export const CourseManagementTeacher = () => {
  const {enqueueSnackbar} = useSnackbar();
  const classes = useStyles();
  const location = useLocation();
  const [courseList, setCourseList] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [courseShortDescription, setCourseShortDescription] = useState('');
  const [courseFullDescription, setCourseFullDescription] = useState('')

  const handlePageChange = (event, value) => {
    setPage(value);
    history.push(`${location.pathname}?page=${value}`)
  };

  useEffect(() => {
    const eff = async () => {
      await fetchCourseList();
    }
    eff();
  }, [page]);


  const fetchCourseList = async () => {
    setIsPending(true);
    try {
      let res = await getAllCourses(page, 5, null, null, null)
      if (res.status !== 200) {
        return;
      }

      setCourseList(res?.data?.results)
      setTotalPage(res?.data.totalPages)
    } catch (e) {
      enqueueSnackbar("Error, can not get course list", {variant: SnackBarVariant.Error});
      console.log(e);
    } finally {
      setIsPending(false);
    }
  }

  const handleDialogOpen = () => {
    setOpen(true);
  }

  const handleDialogClose = () => {
    setOpen(false);
  }

  const handleItemClick = (event, id) => {
    history.push(`/teacher/courses/${id}`);
  }
  const handleCreateCourse = (event, id) => {
    setOpen(false);
  }

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
    setCourseFullDescription(event.target.value)
  }

  return <div>
    <Grid container spacing={3}>
      <Grid container xs={12}>
        <Grid item xs={12} sm={2}/>
        <Grid item xs={12} sm={8}>
          <CustomPrimaryContainedButton onClick={handleDialogOpen} className={classes.button}>
            Create course
          </CustomPrimaryContainedButton>

          <Dialog open={open} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create new course</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter information to create a new course
              </DialogContentText>
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
              <Box fullWidth>
                <ReactQuill onChange={handleCourseFullDescriptionChange} value={courseFullDescription}/>
              </Box>

            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleCreateCourse} color="primary">
                Create
              </Button>
            </DialogActions>
          </Dialog>


          <Box className={classes.blockTitle}>All courses</Box>
          {
            isPending ? <LineListLoading/> :
              courseList?.map(item => {
                return (
                  <Paper
                    onClick={(event) => handleItemClick(event, item?._id)}
                    style={{marginBottom: 10}}
                    className={classes.itemContainer}>
                    <CourseLineItem item={item}/>
                  </Paper>
                )
              })
          }
          <Pagination variant="outlined" color="primary" count={totalPage} page={page} onChange={handlePageChange}/>
        </Grid>
        <Grid item xs={12} sm={2}/>
      </Grid>
    </Grid>
  </div>
}