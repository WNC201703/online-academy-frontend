import Box from "@material-ui/core/Box";
import {Image} from "semantic-ui-react";
import Rating from "@material-ui/lab/Rating";
import {discountFormat, moneyFormat} from "../../utils/FormatHelper";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import grey from "@material-ui/core/colors/grey";

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
  }
}));
export const CourseLineItem = ({item}) => {
  const classes = useStyles();
  const isDiscount = item?.percentDiscount > 0
  return (
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
          <Rating precision={0.5} name="read-only" value={item?.averageRating/2} readOnly/>
          <span> ({item?.numberOfReviews})</span>
        </Box>
        <Box className={classes.originMoney}>{moneyFormat(item?.price)} {isDiscount ?
          <span
            className={classes.discountMoney}>{moneyFormat(discountFormat(item?.price, item?.percentDiscount))}</span> : <></>}
        </Box>
      </Box>
    </Box>)
}