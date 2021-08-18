
import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { useHistory } from "react-router-dom";
import HomeIcon from '@material-ui/icons/Home';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import blue from "@material-ui/core/colors/blue";
import AuthUserContext from "../../contexts/user/AuthUserContext";
import Box from "@material-ui/core/Box";
import {
    Drawer, AppBar, Toolbar, List, ListItem,
    Typography, Divider,
  } from '@material-ui/core';
import { Management } from '../../utils/constant';

  const Keys = {
    Student: 'student',
    Teacher: 'teacher',
    Category: 'category',
    Course: 'course',
  }

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
            '&:hover': {
                cursor: "pointer"
            },
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    itemTitle: {
        fontWeight: 'bold'
    },
}));

export default function AdminAppBar() {
    const classes = useStyles();
    const history = useHistory();
    const { user, removeUser } = useContext(AuthUserContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const [anchorEl2, setAnchorEl2] = React.useState(null);

    const open = Boolean(anchorEl2);
    const location = useLocation();
    const currentPath=location.pathname;
    const handleAccountMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleLogOut = () => {
        history.push('/sign-in');
        removeUser(null);
        setAnchorEl(null);
        handleMobileMenuClose();
    }
    const handleGotoAccount = () => {
        history.push('/account');
        setAnchorEl(null);
        handleMobileMenuClose();
    }

    const handleGotoStudentManagementPage = () => {
        history.push('/student-management');
        setAnchorEl(null);
        handleMobileMenuClose();
    }

    const handleGotoTeacherManagementPage = () => {
        history.push('/teacher-management');
        setAnchorEl(null);
        handleMobileMenuClose();
    }

    const handleGotoCategoryManagementPage = () => {
        history.push('/category-management');
        setAnchorEl(null);
        handleMobileMenuClose();
    }

    const handleGotoCourseManagementPage = () => {
        history.push('/course-management');
        setAnchorEl(null);
        handleMobileMenuClose();
    }

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleTitleClick = () => {
        history.push('/');
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleGotoCourseManagementPage}>Course management</MenuItem>
            <MenuItem onClick={handleGotoCategoryManagementPage}>Category management</MenuItem>
            <MenuItem onClick={handleGotoStudentManagementPage}>Student management</MenuItem>
            <MenuItem onClick={handleGotoTeacherManagementPage}>Teacher management</MenuItem>
            <Divider/>
            <MenuItem onClick={handleGotoAccount}>Account Settings</MenuItem>
            <MenuItem onClick={handleLogOut}>Log out</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem onClick={handleAccountMenuOpen}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit">
                    <AccountCircle />
                </IconButton>
                <p>Account</p>
            </MenuItem>
        </Menu>
    );

    return (
        <div className={classes.grow}>
            <AppBar
                className={classes.appBar}
                style={{ backgroundColor: blue[500] }}
                position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        onClick={handleTitleClick}
                        aria-label="open drawer">
                        <HomeIcon />
                    </IconButton>
                    <Typography className={classes.title} variant="h6" noWrap>
                        {
                            currentPath==='/course-management'   ? 'Course management':
                            currentPath==='/category-management' ? 'Category management':
                            currentPath==='/student-management'  ? 'Teacher management':
                            currentPath==='/teacher-management'  ? 'Student management':
                            currentPath==='/account' ? 'Account':''
                        }
                    </Typography>


                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        {
                            <IconButton
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleAccountMenuOpen}
                                color="inherit">
                                <Typography>{user.fullname}</Typography>
                                <Box m={0.5}></Box>
                                <AccountCircle />
                            </IconButton>
                        }
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit">
                            <MoreIcon />
                        </IconButton>
                    </div>
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
       
      </Drawer>
            {renderMobileMenu}
            {renderMenu}
        </div>
    );
}
