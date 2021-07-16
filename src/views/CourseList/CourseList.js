import React, {useEffect, useState} from "react";
import Box from "@material-ui/core/Box";
import {useSnackbar} from "notistack";
import Paper from "@material-ui/core/Paper";
import {Image} from "semantic-ui-react";
import Rating from "@material-ui/lab/Rating";
import {moneyFormat} from "../../utils/FormatHelper";
import {getAllCourses} from "../../config/api/Courses";
import makeStyles from "@material-ui/core/styles/makeStyles";
import grey from "@material-ui/core/colors/grey";
import {
  LineListLoading,
} from "../../components/Loading";
import {SnackBarVariant} from "../../utils/constant";
import Grid from "@material-ui/core/Grid";
import {useHistory} from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import PageItem from 'react-bootstrap/PageItem'

const useStyles = makeStyles((theme) => ({
  itemTitle: {
    fontWeight: 'bold'
  },
  discountMoney: {
    textDecoration: "line-through",
    fontWeight: "normal"
  },
  originMoney: {
    fontWeight: "bold",
  },
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

export const CourseList = () => {
  const {enqueueSnackbar} = useSnackbar();
  const classes = useStyles();
  const [courseList, setCourseList] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const handlePageChange = (event, value) => {
    setPage(value);
    history.push(`/courses/all?page=${value}`)
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
      const res = await getAllCourses(page, 5, null, null, null);
      if (res.status !== 200) {
        return;
      }
      console.log(res?.data?.results)
      setCourseList(res?.data?.results)
      setTotalPage(res?.data.totalPages)
    } catch (e) {
      enqueueSnackbar("Error, can not get course list", {variant: SnackBarVariant.Error});
      console.log(e);
    } finally {
      setIsPending(false);
    }
  }

  const handleSearchItemClick = (event, id) => {
    history.push(`/courses/${id}`);
  }
  return <div>
    <Grid container spacing={3}>
      <Grid container xs={12}>
        <Grid item xs={12} sm={2}/>
        <Grid item xs={12} sm={8}>
          <Box className={classes.blockTitle}>All courses</Box>
          {
            isPending ? <LineListLoading/> :
              courseList?.map(item => {
                return (
                  <Paper
                    onClick={(event) => handleSearchItemClick(event, item?._id)}
                    style={{marginBottom: 10}}
                    className={classes.itemContainer}>
                    <Box padding={2} display='flex' justify='center' direction={'column'}>
                      <Image
                        src={item?.imageUrl}
                        draggable={false}
                        style={{width: 80, height: 80, marginRight: 8}}/>
                      <Box justify='center'>
                        <Box className={classes.itemTitle}>{item?.name}</Box>
                        <Box>{item?.shortDescription}</Box>
                        <Box display="flex" alignItems="center"
                             justify="center">
                          <Rating name="read-only" value={5} readOnly/>
                          <span>(123)</span>
                        </Box>
                        <Box className={classes.originMoney}>{moneyFormat(item?.price)} {true ?
                          <span className={classes.discountMoney}>{moneyFormat(120)}</span> : <></>}
                        </Box>
                      </Box>
                    </Box>
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