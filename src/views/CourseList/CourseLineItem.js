import Box from "@material-ui/core/Box";
import { Image } from "semantic-ui-react";
import Rating from "@material-ui/lab/Rating";
import { discountFormat, moneyFormat } from "../../utils/FormatHelper";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import grey from "@material-ui/core/colors/grey";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import CustomFavouriteOutlinedButton from "../../components/Button/CustomFavouriteOutlinedButton";
import { removeFavouriteCourse } from "../../config/api/User";
import { SnackBarVariant } from "../../utils/constant";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';

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
const CourseListType = {
  ENROLLMENTS: 'enrollments',
  FAVORITES: 'favorites'
}
export const CourseLineItem = ({ item, type }) => {
  const classes = useStyles();
  const history = useHistory();
  const isDiscount = item?.percentDiscount > 0
  const { enqueueSnackbar } = useSnackbar();

  const handleRemoveFavouriteCourse = async (e, id) => {
    const res = await removeFavouriteCourse(id);
    if (res.status === 204) {
      window.location.reload();

      enqueueSnackbar("Remove favourite course successfully", { variant: SnackBarVariant.Success });
    } else {
      enqueueSnackbar("Can not remove this course from favourite", { variant: SnackBarVariant.Error });
    }
  }

  const handleItemClick = (event, id) => {
    history.push(`/courses/${id}`);
  }

  return (
    <Box padding={2} display='flex' justify='center' direction={'column'}>
      <Image
        src={item?.imageUrl}
        draggable={false}
        style={{ width: 80, height: 80, marginRight: 8 }} />
      <Box justify='center'>
        <Box
          onClick={(event) => handleItemClick(event, item?._id)}
          className={classes.itemTitle}>
          <Link href="" >
            {item?.name}
          </Link>
        </Box>

        <Box>{item?.shortDescription}</Box>
        <Box display="flex" alignItems="center"
          justify="center">
          <Rating precision={0.5} name="read-only" value={item?.averageRating / 2} readOnly />
          <span> ({item?.numberOfReviews})</span>
        </Box>
        <Box className={classes.originMoney}>{moneyFormat(item?.price)} {isDiscount ?
          <span
            className={classes.discountMoney}>{moneyFormat(discountFormat(item?.price, item?.percentDiscount))}</span> : <></>}
        </Box>
        <Box>
          {
            type === CourseListType.FAVORITES ? <CustomFavouriteOutlinedButton
              onClick={(e) => handleRemoveFavouriteCourse(e, item?._id)}
              size="large"
              style={{ marginRight: 12 }}>
              Remove from favourite
            </CustomFavouriteOutlinedButton> : <></>
          }
        </Box>
      </Box>
    </Box>)
}