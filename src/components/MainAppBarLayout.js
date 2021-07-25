import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonAppBar from "./AppBar/AppBar";

const useStyles = makeStyles(theme => ({

}));

const MainAppBarLayout = props => {
  const { children } = props;
  const classes = useStyles();

  return (
    <div>
      <ButtonAppBar />
      <div className={classes.page}>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainAppBarLayout;