import {withStyles} from "@material-ui/core";
import blue from "@material-ui/core/colors/blue";
import Button from "@material-ui/core/Button";
import pink from "@material-ui/core/colors/pink";

const CustomEnrollOutlinedButton = withStyles({
  root: {
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    color: blue[400],
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: 'transparent',
    borderColor: blue[400],
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      borderColor: blue[900],
      color: blue[900],
      boxShadow: 'none',
      backgroundColor: blue[100],

    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: blue[100],
      borderColor: blue[100],
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },
  },
})(Button);

export default CustomEnrollOutlinedButton