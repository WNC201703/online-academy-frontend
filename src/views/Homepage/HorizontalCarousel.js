import Carousel from "react-multi-carousel";
import {Image} from "semantic-ui-react";
import React from "react";
import Box from "@material-ui/core/Box";
import Rating from '@material-ui/lab/Rating';
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core";
import {discountFormat, moneyFormat, ratingNumberFormat} from "../../utils/FormatHelper";
import {useHistory} from "react-router-dom";
import {grey, yellow} from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    textAlign: 'left',
    color: theme.palette.text.secondary,
    marginBottom: 12,
    '&:hover': {
      cursor: "pointer"
    },
  },
  title: {
    fontWeight: "bold",
    
  },
  blockTitle: {
    fontWeight: "bold",
    fontSize: 26
  },
  discountMoney: {
    textDecoration: "line-through",
    fontWeight: "normal"
  },
  originMoney: {
    fontWeight: "bold",
  }
}));

const responsive = {
  desktop: {
    breakpoint: {max: 3000, min: 1024},
    items: 3,
    paritialVisibilityGutter: 60
  },
  tablet: {
    breakpoint: {max: 1024, min: 464},
    items: 2,
    paritialVisibilityGutter: 50
  },
  mobile: {
    breakpoint: {max: 464, min: 0},
    items: 1,
    paritialVisibilityGutter: 30
  }
};

const HorizontalCarousel = ({title, data}) => {
  const classes = useStyles();
  const history = useHistory();
  const handleItemClick = (event, id) => {
    history.push(`/courses/${id}`);
  }

  return (
    <Box>
      <Box className={classes.blockTitle}>{title}</Box>
      <Carousel
        ssr
        partialVisbile
        deviceType={"desktop"}
        itemClass="image-item"
        responsive={responsive}>
        {data.map((item, index) => {
          const isDiscount = item?.percentDiscount > 0
          return (
            <Paper className={classes.paper} key={index}
                   onClick={(event) => handleItemClick(event, item._id)}
                   style={{marginRight: 8, padding: 5}}>
              <Image
                draggable={false}
                style={{width: "100%", height: 250}}
                src={item?.imageUrl}
              />
              <Box className={classes.title}>{item.name}</Box>
              <Box>{item?.category} - {item?.teacher}</Box>
              <Box className={classes.originMoney}>{moneyFormat(item?.price)} {isDiscount ?
                <span
                  className={classes.discountMoney}>{moneyFormat(discountFormat(item?.price, item?.percentDiscount))}
                </span> : <></>}
              </Box>
              <Box display="flex" alignItems="center"
                   justify="center">
                <Rating name="read-only" value={ratingNumberFormat(item?.averageRating)} readOnly/>
                <span>({item?.numberOfReviews})</span>
                {
                  item?.new ?
                    <Box style={{
                      backgroundColor: yellow[300], borderRadius: 5, padding: 5, fontWeight: 'bold',
                      margin: 8, color: 'black'
                    }}> New </Box> : <></>
                }
                {
                  item?.bestseller ?
                    <Box style={{
                      backgroundColor: yellow[300], borderRadius: 5, padding: 5, fontWeight: 'bold',
                      margin: 8, color: 'black'
                    }}> Best seller </Box> : <></>
                }
              </Box>
              {
                !item?.upload_complete ?
                  <Box style={{
                    backgroundColor: grey[300], borderRadius: 5, padding: 5, fontWeight: 'bold',
                    margin: 8, color: 'black'
                  }}> Not completed</Box> : <></>
              }
            </Paper>
          );
        })}
      </Carousel>
    </Box>

  );
};

export default HorizontalCarousel;
