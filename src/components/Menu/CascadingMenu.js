import React from "react";
import PropTypes from "prop-types";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import ArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import {useHistory} from "react-router-dom";

const styles = theme => ({
    rootMenu: {
        overflow: "visible"
    },
    menuItem: {
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        overflow: "visible",
        position: "relative",
        "& a": {
            color: theme.palette.common.black
        }
    },
    name: {
        alignItems: "center",
        display: "flex"
    },
    arrowIcon: {
        paddingLeft: 24
    },
    subMenu: {
        opacity: "0",
        position: "absolute",
        right: "100%",
        transform: "scale(0.75, 0.5625)",
        transformOrigin: "top right",
        transition: `opacity ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut
            } 0ms, transform ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut
            } 0ms`, // match Menu transition
        top: "-8px",
        visibility: "hidden"
    },
    subMenuOpen: {
        transform: "scale(1, 1) translateZ(0px)",
        visibility: "visible",
        opacity: "1"
    }
});

class CascadingMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            subMenuStates: []
        };

    }

    handleItemClick = (event, menuItem) => {
        const subMenuStates = [...this.state.subMenuStates];

        let ignore=false;
        subMenuStates.forEach(subMenuState => {
            if (subMenuState.open && subMenuState._id === menuItem._id){
                    ignore=true;
            }
        });
        if (!ignore) this.props.history.push(`/courses/all/${menuItem._id}`);
        this.closeAllMenus();

    };

    handleItemHover = (event, menuItem) => {
        const hasSubMenu = !!(
            menuItem.children && menuItem.children.length
        );

        if (hasSubMenu) {
            // hide already open sub menus and open the requested sub menu
            const subMenuStates = [...this.state.subMenuStates];
            for (const subMenuState of subMenuStates) {
                if (subMenuState._id === menuItem._id) {
                    subMenuState.open = !subMenuState.open;
                } else {
                    subMenuState.open = false;
                }
            }

            this.setState({ subMenuStates });
        } 
    };
    

    closeAllMenus() {
        this.setState({ subMenuStates: [] });
        this.props.onClose();
    }

    renderMenuItem = menuItem => {
        const { classes } = this.props;
        const { subMenuStates } = this.state;
        const hasSubMenu = !!(
            menuItem.children && menuItem.children.length
        );
        let subMenuState = subMenuStates.find(
            menuState => menuState._id === menuItem._id
        );

        // initialize state for sub menu
        if (hasSubMenu && !subMenuState) {
            subMenuState = {
                _id: menuItem._id,
                anchorElement: null,
                open: false
            };

            subMenuStates.push(subMenuState);
        }

        return (
            <MenuItem
                onMouseEnter={e => this.handleItemHover(e, menuItem)}
                onClick={e => this.handleItemClick(e, menuItem)}
                className={classes.menuItem}
                key={menuItem._id}
            >
                <div className={classes.name}>{menuItem.name}</div>
                {hasSubMenu && (
                    <React.Fragment>
                        <ArrowRightIcon className={classes.arrowIcon} />
                        <Paper
                            className={`${classes.subMenu} ${subMenuState.open ? classes.subMenuOpen : ""
                                }`}
                        >
                            <MenuList>
                                {menuItem.children.map(subMenuItem =>
                                    this.renderMenuItem(subMenuItem)
                                )}
                            </MenuList>
                        </Paper>
                    </React.Fragment>
                )}
            </MenuItem>
        );
    };

    render() {
        // no-unused-vars is disabled so that menuItems isn't passed to Menu
        // eslint-disable-next-line no-unused-vars
        const {
            anchorElement,
            open,
            onClose,
            menuItems,
            classes,
            ...others
        } = this.props;

        return (
            <Menu
                {...others}
                anchorEl={anchorElement}
                elevation={2}
                classes={{
                    paper: classes.rootMenu
                }}
                open={open}
                onClose={() => this.closeAllMenus()}
            >
                {menuItems.map(menuItem => this.renderMenuItem(menuItem))}
            </Menu>
        );
    }
}

CascadingMenu.propTypes = {
    anchorElement: PropTypes.any,
    classes: PropTypes.any,
    menuItems: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};

export default withStyles(styles)(CascadingMenu);
