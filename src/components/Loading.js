import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import grey from "@material-ui/core/colors/grey";


const useStyles = makeStyles((theme) => ({
  loading: {
    color: grey[100],
    background: "transparent"
  }
}));
export const CourseInfoLoading = () => {
  const classes = useStyles();

  return (
    <Box>
      <Box className={classes.loading}><Skeleton width="100%" height={250} animation="wave"/></Box>
      <Box className={classes.loading}><Skeleton width={250} height={100} animation="wave"/></Box>
      <Box className={classes.loading}><Skeleton animation="wave"/></Box>
      <Box className={classes.loading}><Skeleton animation="wave"/></Box>
      <Box className={classes.loading}><Skeleton width={250} animation="wave"/></Box>
    </Box>)
}

export const DescriptionLoading = () => {
  const classes = useStyles();
  return (
    <Box>
      <Box className={classes.loading}><Skeleton width="100%" height={250} animation="wave"/></Box>
    </Box>)
}

export const LessonsLoading = () => {
  const classes = useStyles();
  let arr = [1, 2, 3, 4, 5, 6, 7];
  return <Box> {
    arr.map(_ => <Box className={classes.loading}><Skeleton height={30} animation="wave"/></Box>)
  }      </Box>
}
export const RelatedCourseLoading = () => {
  const classes = useStyles();
  let arr = [1, 2, 3, 4, 5];
  return <Box display='flex' direction='column' justify={'space-between'}> {
    arr.map(_ => <Box style={{marginRight: 12}} className={classes.loading}>
        <Skeleton height={300} width={150} animation="wave"/>
        <Skeleton height={30} width={150} animation="wave"/>
        <Skeleton height={30} width={150} animation="wave"/>
        <Skeleton height={30} width={150} animation="wave"/>
      </Box>
    )
  }      </Box>
}