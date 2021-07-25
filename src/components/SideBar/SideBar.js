import {Menu, ProSidebar, SidebarContent, SubMenu} from "react-pro-sidebar";
import React, {useEffect, useRef} from "react";
import {useLocation} from "react-router-dom";
import {
  BsFillPersonLinesFill,
  FaChartLine
} from "react-icons/all";
import makeStyles from "@material-ui/core/styles/makeStyles";
import SubHeader from "./SubHeader";
import EnhancedMenuItem from "./EnhancedMenuItem";
import {useState} from "react";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      height: '100%',
      position: 'fixed',
      paddingTop: "65px",
      top: 0,
      bottom: 0,
      overflow: 'hidden',
      [theme.breakpoints.down('sm')]: {
        paddingTop: 0
      }
    },
    content: {
      borderRight: '2px solid #E7E7E7',
      height: '100%',
      overflowY: 'auto',
      boxSizing: 'content-box',
      "&::-webkit-scrollbar-track": {
        backgroundColor: "#FAFBFC",
      },
      "&::-webkit-scrollbar": {
        width: 5,
        backgroundColor: "#FAFBFC",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#cdd0cb",
      },
    },
    subHeader: {
      marginTop: "-10px",
      fontSize: '15px'
    },
    space: {
      height: '20px'
    },
    subMenuItem: {
      marginLeft: '20px'
    },
    subMenu: {
      color: "#123456",
      '& .pro-inner-list-item': {
        '& div': {
          '& ul': {
            paddingTop: 'unset'
          }
        }
      }
    }
  }
});

export default function SideBar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const classes = useStyles();
  // const {sidebarToggled, setSidebarToggled} = useContext(SidebarContext);

  const wrapperRef = useRef(null);
  // useEffect(() => {
  //   if (sidebarToggled) {
  //     function handleClickOutside(event) {
  //       if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
  //         setSidebarToggled(!sidebarToggled)
  //       }
  //     }
  //
  //     // Bind the event listener
  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => {
  //       // Unbind the event listener on clean up
  //       document.removeEventListener("mousedown", handleClickOutside);
  //     };
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [wrapperRef, sidebarToggled]);
  //
  // const isAdmin = useMemo(() => {
  //   return user && user.role.includes(admin);
  // }, [user]);

  useEffect(() => {
    if (location.pathname.includes('reports')) setOpen(true)
    else setOpen(false)
  }, [location.pathname])

  return (
    <ProSidebar
      className={classes.root}
      breakPoint="md">
      <SidebarContent ref={wrapperRef} className={classes.content}>
        <div className={classes.space}/>
        <Menu>
          <SubHeader className={classes.subHeader}>{'Dashboard'}</SubHeader>
          <EnhancedMenuItem
            icon={<BsFillPersonLinesFill/>}
            linkTo="/teacher/courses">
            {'Courses'}
          </EnhancedMenuItem>
        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
}