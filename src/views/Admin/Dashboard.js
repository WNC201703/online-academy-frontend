import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import MenuBook from '@material-ui/icons/MenuBook';
import EmojiPeople from '@material-ui/icons/EmojiPeople';
import NaturePeople from '@material-ui/icons/NaturePeople';
import Students from './Students'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  active: {
    backgroundColor: "#b2fab4"
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

export default function PermanentDrawerLeft() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>
          {
            <ListItem button key='Students' 
            className={classes.active}>
              <ListItemIcon>{<EmojiPeople/>}</ListItemIcon>
              <ListItemText primary='Students' />
            </ListItem>
          },
           {
            <ListItem button key='Teachers'>
              <ListItemIcon>{<NaturePeople/>}</ListItemIcon>
              <ListItemText primary='Teachers' />
            </ListItem>
          }
        </List>
        <Divider />
        <List>
        {
            <ListItem button key='Categories'>
              <ListItemIcon>{<LibraryBooks/>}</ListItemIcon>
              <ListItemText primary='Categories' />
            </ListItem>
          }
        </List>
        <Divider />
        <List>
          {
            <ListItem button key='Courses'>
              <ListItemIcon>{<MenuBook/>}</ListItemIcon>
              <ListItemText primary='Courses' />
            </ListItem>
          }
        </List>
      </Drawer>
      
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Students />
      </main>
    </div>
  );
}
