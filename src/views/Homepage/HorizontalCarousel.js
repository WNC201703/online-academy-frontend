import Carousel from "react-multi-carousel";
import {Image} from "semantic-ui-react";
import React from "react";
import Box from "@material-ui/core/Box";
import Rating from '@material-ui/lab/Rating';
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core";
import {moneyFormat} from "../../utils/FormatHelper";

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
    fontWeight: "bold"
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
const images = [
  "https://images.unsplash.com/photo-1549989476-69a92fa57c36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1549396535-c11d5c55b9df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1550133730-695473e544be?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1550167164-1b67c2be3973?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1550338861-b7cfeaf8ffd8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1550223640-23097fc71cb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1550353175-a3611868086b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1550330039-a54e15ed9d33?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1549737328-8b9f3252b927?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1549833284-6a7df91c1f65?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1549985908-597a09ef0a7c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1550064824-8f993041ffd3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1549985908-597a09ef0a7c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
];

const HorizontalCarousel = ({title, data}) => {
  const classes = useStyles();
  const handleItemClick = () => {
    console.log("Item Click");
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
          const isDiscount = true;
          return (
            <Paper className={classes.paper} key={index} onClick={handleItemClick} style={{marginRight: 8, padding: 5}}>
              <Image
                draggable={false}
                style={{width: "100%", height: 250}}
                src={item?.imageUrl}
              />
              <Box className={classes.title}>{item.name}</Box>
              <Box>{item?.category} - {item?.teacher}</Box>
              <Box className={classes.originMoney}>{moneyFormat(item?.price)} {isDiscount ?
                <span className={classes.discountMoney}>{moneyFormat(120)}</span> : <></>} </Box>
              <Box display="flex" alignItems="center"
                   justify="center">
                <Rating name="read-only" value={5} readOnly/>
                <span>(123)</span>
              </Box>
            </Paper>
          );
        })}
      </Carousel>
    </Box>

  );
};

export default HorizontalCarousel;
