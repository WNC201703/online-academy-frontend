import React, {useCallback, useContext, useEffect, useState} from 'react';
import {fade, makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {useHistory} from "react-router-dom";
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import DropdownMenu from "../Menu/DropdownMenu";
import blue from "@material-ui/core/colors/blue";
import CustomPrimaryContainedButton from "../Button/CustomPrimaryContainedButton";
import CustomSecondaryOutlinedButton from "../Button/CustomSecondaryOutlinedButton";
import AuthUserContext from "../../contexts/user/AuthUserContext";
import Box from "@material-ui/core/Box";
import Popover from "@material-ui/core/Popover";

import debounce from "@material-ui/core/utils/debounce";
import {getAllCourses} from "../../config/api/Courses";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import {Image} from "semantic-ui-react";
import Rating from "@material-ui/lab/Rating";
import {moneyFormat} from "../../utils/FormatHelper";
import grey from "@material-ui/core/colors/grey";
import CustomEnrollOutlinedButton from "../Button/CustomEnrollOutlinedButton";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import {getCategoriesList} from "../../config/api/Categories";

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
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
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
  discountMoney: {
    textDecoration: "line-through",
    fontWeight: "normal"
  },
  originMoney: {
    fontWeight: "bold",
  },
  itemDescription: {
    whiteSpace: 'nowrap',
    display: 'webkit-box',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitLineClamp: 2,
  },
  itemContainer: {
    '&:hover': {
      backgroundColor: grey[300],
      cursor: "pointer"
    },
  }
}));

export default function PrimarySearchAppBar() {
  const classes = useStyles();
  const history = useHistory();
  const {user, removeUser} = useContext(AuthUserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const eff = async () => {
      await fetchCategoriesList();
    }
    eff();
  }, []);

  const fetchCategoriesList = async () => {
    const res = await getCategoriesList();
    const categoryList = res.data
    let parentCategory = {}

    ///Convert parent categories with hashmap
    for (const item of categoryList) {
      if (item.parent === null) {
        parentCategory[item._id] = item;
        parentCategory[item._id].childrens = []
      }
    }

    for (const item of categoryList) {
      if (item.parent !== null && parentCategory[item.parent] !== null) {
        parentCategory[item.parent].childrens.push(item)
      }
    }

    const newCategories = Object.keys(parentCategory)
      .map(function (key) {
        return parentCategory[key];
      });

    setCategories(newCategories)
  }

  const debounceSearchRequest = useCallback(debounce((nextValue) => searchCourse(nextValue), 1000), []);
  const searchCourse = async (value) => {
    setIsSearching(true);
    if (value.length === 1) {
      setIsSearching(false);
      return
    }
    const response = await getAllCourses(1, 10, null, value, null);
    if (response.status === 200) {
      const result = response.data;
      setSearchResult(result.results);
    }
    setIsSearching(false);
    setAnchorEl2(true);
  }

  const handleSearchInputChange = async (event) => {
    setSearch(event.target.value);
    if (event.target.value.length > 0) debounceSearchRequest(event.target.value);
  }

  const handleSearchItemClick = (event, id) => {
    setSearch('');
    history.push(`/courses/${id}`);
  }

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorEl2(null);
  };

  const open = Boolean(anchorEl2);
  const id = open ? 'simple-popover' : undefined;

  const handleProfileMenuOpen = (event) => {
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
  const handleGotoProfile = () => {
    history.push('/profile');
    setAnchorEl(null);
    handleMobileMenuClose();
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSignInButtonClick = () => {
    history.push('/sign-in');
  }

  const handleSignUpButtonClick = () => {
    history.push('/sign-up');
  }

  const handleShowAllSearchResult = () => {
    setAnchorEl2(null);
    history.push('/courses/all');
  }

  const handleTitleClick = () => {
    history.push('/');
  }

  const handleGotoFavourites = () => {
    history.push('/me/favorites');
  }


  const handleGotoEnrollments = () => {
    history.push('/me/enrollments');
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      id={menuId}
      keepMounted
      transformOrigin={{vertical: 'top', horizontal: 'right'}}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleGotoEnrollments}>Enrollments</MenuItem>
      <MenuItem onClick={handleGotoFavourites}>Favourites</MenuItem>
      <MenuItem onClick={handleGotoProfile}>Profile</MenuItem>
      <MenuItem onClick={handleLogOut}>Log out</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{vertical: 'top', horizontal: 'right'}}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit">
          <AccountCircle/>
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar
        style={{backgroundColor: blue[500]}}
        position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer">
            <MenuIcon/>
          </IconButton>
          <Typography onClick={handleTitleClick} className={classes.title} variant="h6" noWrap>
            Online Academy
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              {
                isSearching ? <CircularProgress size={16}/> : <SearchIcon/>
              }
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              value={search}
              onChange={handleSearchInputChange}
              inputProps={{'aria-label': 'search'}}
            />

          </div>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl2}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            style={{marginTop: 50, marginLeft: 120, padding: 12}}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Box height={450}>
              {
                searchResult?.map(item => {
                  return (
                    <Paper
                      style={{marginBottom: 10}}
                      onClick={(event) => {
                        setAnchorEl2(null);
                        handleSearchItemClick(event, item._id)
                      }}
                      className={classes.itemContainer}>
                      <Box padding={2} display='flex' justify='center' direction={'column'}>
                        <Image
                          src={item?.imageUrl}
                          draggable={false}
                          style={{width: 80, height: 80, marginRight: 8}}/>
                        <Box width={300} justify='center'>
                          <Box className={classes.itemTitle}>{item?.name}</Box>
                          <Box className={classes.itemDescription}>{item?.shortDescription}</Box>
                          <Box display="flex" alignItems="center"
                               justify="center">
                            <Rating name="read-only" value={5} readOnly/>
                            <span>(123)</span>
                          </Box>
                          <Box className={classes.originMoney}>{moneyFormat(item?.price)} {true ?
                            <span className={classes.discountMoney}>{moneyFormat(120)}</span> : <></>}
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  )
                })
              }
              <Box>
                <CustomEnrollOutlinedButton
                  style={{marginBottom: 24, marginLeft: 12, marginRight: 30, paddingRight: 30, width: '95%'}}
                  onClick={handleShowAllSearchResult}
                  size="small"
                  startIcon={<AddCircleOutlineIcon/>}
                >
                  Show all results
                </CustomEnrollOutlinedButton> </Box>
            </Box>
          </Popover>
          <DropdownMenu data={categories}/>
          <div className={classes.grow}/>
          <div className={classes.sectionDesktop}>
            {
              (user && user._id) ? <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit">
                    <Typography >{user.fullname}</Typography>
                    <Box m={0.5}></Box>
                  <AccountCircle/>
                </IconButton> :
                <Box>
                  <CustomPrimaryContainedButton onClick={handleSignInButtonClick} style={{marginRight: 8}}
                                                variant="contained"
                                                color="primary">Sign in</CustomPrimaryContainedButton>
                  <CustomSecondaryOutlinedButton onClick={handleSignUpButtonClick} variant="outlined">Sign
                    up</CustomSecondaryOutlinedButton>
                </Box>

            }
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit">
              <MoreIcon/>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
