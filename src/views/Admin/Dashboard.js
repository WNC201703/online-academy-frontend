import React, { useState } from "react";
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
import StudentManagementPage from './StudentManagementPage'
import TeacherManagementPage from './TeacherManagementPage'

const drawerWidth = 240;

const Keys = {
  Student: 'student',
  Teacher: 'teacher',
  Category: 'category',
  Course: 'course',
}

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
  const [selectedItem, setSelectedItem] = useState(Keys.Student);

  const page = () => {
    switch(selectedItem){
      case Keys.Student:
        return <StudentManagementPage/>
      case Keys.Teacher:
        return <TeacherManagementPage/>
      case Keys.Category:
        return <StudentManagementPage/>
      case Keys.Course:
        return <StudentManagementPage/>
    }
  }
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
            <ListItem onClick={() => setSelectedItem(Keys.Student)} button key={Keys.Student}
              className={(selectedItem === Keys.Student ? classes.active : '')} >
              <ListItemIcon>{<EmojiPeople />}</ListItemIcon>
              <ListItemText primary='Students' />
            </ListItem>
          },
          {
            <ListItem onClick={() => setSelectedItem(Keys.Teacher)} button key={Keys.Teacher}
              className={(selectedItem === Keys.Teacher ? classes.active : '')} >
              <ListItemIcon>{<NaturePeople />}</ListItemIcon>
              <ListItemText primary='Teacher' />
            </ListItem>
          }
        </List>
        <Divider />
        <List>
          {
            <ListItem onClick={() => setSelectedItem(Keys.Category)} button key={Keys.Category}
              className={(selectedItem === Keys.Category ? classes.active : '')} >
              <ListItemIcon>{<LibraryBooks />}</ListItemIcon>
              <ListItemText primary='Category' />
            </ListItem>
          }
        </List>
        <Divider />
        <List>
          {
            <ListItem onClick={() => setSelectedItem(Keys.Course)} button key={Keys.Course}
              className={(selectedItem === Keys.Course ? classes.active : '')}>
              <ListItemIcon>{<MenuBook />}</ListItemIcon>
              <ListItemText primary='Course' />
            </ListItem>
          }
        </List>
      </Drawer>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        {page()}
      </main>
    </div>
  );
}
