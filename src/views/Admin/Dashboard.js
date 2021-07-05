import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
  Drawer, CssBaseline, AppBar, Toolbar, List, ListItem,
  Typography, Divider, ListItemIcon, ListItemText
} from '@material-ui/core';
import { LibraryBooks, MenuBook, EmojiPeople, NaturePeople } from '@material-ui/icons';
import StudentManagementPage from './Student/StudentManagementPage'
import TeacherManagementPage from './Teacher/TeacherManagementPage'
import CourseManagementPage from './Course/CourseManagementPage'
import CategoryManagementPage from './Category/CategoryManagementPage'
import blue from "@material-ui/core/colors/blue";

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
    backgroundColor: blue[500]
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  active: {
    backgroundColor: blue[100]
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
    switch (selectedItem) {
      case Keys.Student:
        return <StudentManagementPage />
      case Keys.Teacher:
        return <TeacherManagementPage />
      case Keys.Category:
        return <CategoryManagementPage />
      case Keys.Course:
        return <CourseManagementPage />
      default:
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
              <ListItemText primary='Student' />
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
