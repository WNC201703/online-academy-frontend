import React, {useEffect, useState} from "react";
import Box from "@material-ui/core/Box";
import {useSnackbar} from "notistack";
import Paper from "@material-ui/core/Paper";
import {getAllCourses, getEnrollmentsCourse, getFavoriteCourses} from "../../config/api/Courses";
import makeStyles from "@material-ui/core/styles/makeStyles";
import grey from "@material-ui/core/colors/grey";
import {
  LineListLoading,
} from "../../components/Loading";
import {SnackBarVariant} from "../../utils/constant";
import Grid from "@material-ui/core/Grid";
import {useHistory, useLocation, useParams} from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import {getCategoryById} from "../../config/api/Categories";
import {CourseLineItem} from "./CourseLineItem";


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
}));

const CourseListType = {
  ENROLLMENTS: 'enrollments',
  FAVORITES: 'favorites'
}

export const CourseList = () => {
  const {enqueueSnackbar} = useSnackbar();
  const classes = useStyles();
  const location = useLocation();
  const [courseList, setCourseList] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [categoryName, setCategoryName] = useState(null);
  const {categoryId} = useParams();
  const {type} = useParams();

  const handlePageChange = (event, value) => {
    setPage(value);
    history.push(`${location.pathname}?page=${value}`)
  };

  useEffect(() => {
    const eff = async () => {
      await fetchCourseList();
    }
    eff();
  }, [page, categoryId, type]);


  const fetchCourseList = async () => {
    setIsPending(true);
    try {
      let res;
      let category
      if (categoryId === undefined) {
        category = null;
      } else {
        category = categoryId
        const result = await getCategoryById(category);
        setCategoryName(result?.data?.name)
      }

      if (type === CourseListType.FAVORITES) {
        res = await getFavoriteCourses();
        setCourseList(res?.data)
      } else if (type === CourseListType.ENROLLMENTS) {
        res = await getEnrollmentsCourse();
      } else res = await getAllCourses(page, 5, null, null, category)

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

  const handleItemClick = (event, id) => {
    history.push(`/courses/${id}`);
  }
  return <div>
    <Grid container spacing={3}>
      <Grid container xs={12}>
        <Grid item xs={12} sm={2}/>
        <Grid item xs={12} sm={8}>
          <Box className={classes.blockTitle}> {categoryName ?? ' All courses'} </Box>
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