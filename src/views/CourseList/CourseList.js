import React, { useContext, useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import { useSnackbar } from "notistack";
import Paper from "@material-ui/core/Paper";
import { getAllCourses, getEnrollmentsCourse, getFavoriteCourses } from "../../config/api/Courses";
import makeStyles from "@material-ui/core/styles/makeStyles";
import grey from "@material-ui/core/colors/grey";
import {
  LineListLoading,
} from "../../components/Loading";
import { SnackBarVariant, SortType } from "../../utils/constant";
import Grid from "@material-ui/core/Grid";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { useHistory, useLocation, useParams } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { getCategoryById } from "../../config/api/Categories";
import { CourseLineItem } from "./CourseLineItem";
import AuthUserContext from "../../contexts/user/AuthUserContext";


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
  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();
  const location = useLocation();
  const [courseList, setCourseList] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [sortType, setSortType] = useState();
  const [categoryName, setCategoryName] = useState(null);
  const { categoryId } = useParams();
  const { type } = useParams();

  const handlePageChange = (event, value) => {
    setPage(value);
    history.push(`${location.pathname}?page=${value}`)
  };

  useEffect(() => {
    const eff = async () => {
      await fetchCourseList();
    }
    eff();
  }, [page, categoryId, type, sortType]);


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
        setCourseList(res?.data)
      } else {
        let sort = '';
        switch (sortType) {
          case SortType.HighestRated: sort = 'rating'; break;
          case SortType.MostPopular: sort = 'reviews'; break;
          case SortType.Newest: sort = 'createdAt'; break;
        }
        res = await getAllCourses(page, 5, sort, null, category)
        setCourseList(res?.data?.results)
      }
      if (res.status !== 200) {
        return;
      }

      setTotalPage(res?.data.totalPages)
    } catch (e) {
      enqueueSnackbar("Error, can not get course list", { variant: SnackBarVariant.Error });
      console.log(e);
    } finally {
      setIsPending(false);
    }
  }

  const handleItemClick = (event, id) => {
    history.push(`/courses/${id}`);
  }

  const handleSort = (event) => {
    setPage(1);
    setSortType(event.target.value);
  };
  return <div>

    <Grid container spacing={3}>
      <Grid container xs={12}>
        <Grid item xs={12} sm={2} />
        <Grid item xs={12} sm={8}>
          {type === CourseListType.ENROLLMENTS || type === CourseListType.FAVORITES ? <div /> :
            <FormControl style={{ marginTop: 50, width: 200 }} variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">Sort</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={sortType}
                onChange={handleSort}
                label="Age"
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value={SortType.MostPopular}>Most Popular</MenuItem>
                <MenuItem value={SortType.HighestRated}>Highest Rated</MenuItem>
                <MenuItem value={SortType.Newest}>Newest</MenuItem>
              </Select>
            </FormControl>
          }
          <Box className={classes.blockTitle}> {categoryName ?? ' All courses'} </Box>
          {
            isPending ? <LineListLoading /> :
              courseList?.map(item => {
                return (
                  <Paper
                    onClick={(event) => handleItemClick(event, item?._id)}
                    style={{ marginBottom: 10 }}
                    className={classes.itemContainer}>
                    <CourseLineItem type={type} item={item} />
                  </Paper>
                )
              })
          }
          <Pagination variant="outlined" color="primary" count={totalPage} page={page} onChange={handlePageChange} />
        </Grid>
        <Grid item xs={12} sm={2} />
      </Grid>
    </Grid>
  </div>
}