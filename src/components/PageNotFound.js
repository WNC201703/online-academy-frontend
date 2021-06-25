import { React } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Typography,
  Button
} from "@material-ui/core";
import Image from "./LazyImage";

const useStyles = makeStyles(theme => ({
  image: {
    width: 500,
    height: 500,
    [theme.breakpoints.down('sm')]: {
      width: 320,
      height: 320,
    },

  },
}));

export default function PageNotFound() {
  const history = useHistory();
  const classes = useStyles();
  const handleClick = () => history.push('/');
  return (
    <Box display="flex" flexDirection="column" alignItems="center" width={1} p={1} pt={0}>
      <Image
        className={classes.image}
        src="/images/illustrations/notfound.jpg"
        alt="NotFound"
        lazy={false}
      />
      <Typography variant="h6">The page you are looking for might have been removed had its name changed or is temporarily unavailable.</Typography>
      <br/>
      <Button variant="outlined" color="primary" onClick={handleClick}>Go to Homepage</Button>
    </Box>
  );
}