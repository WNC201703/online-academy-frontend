import {withStyles} from "@material-ui/core";
import blue from "@material-ui/core/colors/blue";
import Button from "@material-ui/core/Button";
import grey from "@material-ui/core/colors/grey";

const CustomViewContainedButton = withStyles({
  root: {
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    color:' white',
    backgroundColor: blue[900],
    borderColor: blue[900],
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
      backgroundColor: blue[100],
      borderColor: blue[100],
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#0062cc',
      borderColor: '#005cbf',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },
    '&:disabled': {
      backgroundColor: grey[500],
      borderColor: grey[100],
    },
  },
})(Button);

export default CustomViewContainedButton