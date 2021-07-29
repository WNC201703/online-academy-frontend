import makeStyles from "@material-ui/core/styles/makeStyles";
import {React} from "react";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: "flex",
      alignItem: "center",
      padding: "8px 20px 8px 25px",
      fontWeight: "bold"
    }
  }
});

export default function SubHeader({children, className, ...props}) {
  const classes = useStyles();

  return (
  <li className={className} { ...props}>
    <div className={classes.root}>
      {children}
    </div>
  </li>)
}