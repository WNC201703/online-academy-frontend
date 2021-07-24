import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import WebIcon from '@material-ui/icons/Web';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import CustomPrimaryContainedButton from "../Button/CustomPrimaryContainedButton";
import {useHistory} from "react-router-dom";

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
  menuItem: {
    minWidth: 120
  }
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function DropdownMenu({data}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);

  const history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleItemClicked = (categoryId) => {
    history.push(`/courses/all/${categoryId}`)
    handleClose()
  }

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorEl2(null)
  };

  const handleItemHover = (event) => {
    setAnchorEl2(event.currentTarget)
  }

  console.log("category data:", data)

  return (
    <div>
      <CustomPrimaryContainedButton
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={handleClick}>
        Categories
      </CustomPrimaryContainedButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        {
          data?.map(item => <StyledMenuItem onMouseEnter={(event) => handleItemHover(event)}
                                            onClick={() => handleItemClicked(item._id)} style={{minWidth: 120}}>
            <ListItemText primary={item.name}/>
          </StyledMenuItem>)
        }
      </StyledMenu>

      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose}>
        {
          data[0]?.childrens?.map(item => <StyledMenuItem onClick={() => handleItemClicked(item._id)}
                                                          style={{minWidth: 120}}>
            <ListItemText primary={item.name}/>
          </StyledMenuItem>)
        }
      </StyledMenu>

    </div>
  );
}
