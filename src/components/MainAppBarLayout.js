import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonAppBar from "./AppBar/AppBar";

const useStyles = makeStyles(theme => ({
  page: {
    backgroundColor: '#FAFBFC',
    marginLeft: '200px',
    width: 'calc(100% - 200px)',
    height: '100%',
    padding: '15px 40px 0 40px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginLeft: '0px',
      padding: '15px 5px 0 5px',
    },
  },
}));

const MainAppBarLayout = props => {
  const { children } = props;
  const classes = useStyles();

  return (
    <div style={{ display: 'flex', flexGrow: 1, width: '100%', height: '100%' }}>
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