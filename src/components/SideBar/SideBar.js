import { Menu, ProSidebar, SidebarContent, SubMenu } from "react-pro-sidebar";
import React, {useMemo, useContext, useEffect, useRef} from "react";
import { useLocation } from "react-router-dom";
import useLabels from "../../translations/useLabels";
import {
  BsFillPersonLinesFill,
  FiShoppingBag,
  FaChartLine
} from "react-icons/all";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AuthUserContext from "../../context/AuthUserContext";
import SubHeader from "./SubHeader";
import EnhancedMenuItem from "./EnhancedMenuItem";
import { admin } from '../../constants/role';
import { useState } from "react";
import SidebarContext from "../../context/SidebarContext";

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
  const labels = useLabels();
  const { user } = useContext(AuthUserContext);
  const {sidebarToggled, setSidebarToggled} = useContext(SidebarContext);

  const wrapperRef = useRef(null);
  useEffect(() => {
    if (sidebarToggled) {
      function handleClickOutside(event) {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
          setSidebarToggled(!sidebarToggled)
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrapperRef, sidebarToggled]);

  const isAdmin = useMemo(() => {
    return user && user.role.includes(admin);
  }, [user]);

  useEffect(() => {
    if(location.pathname.includes('reports')) setOpen(true)
    else setOpen(false)
  },[location.pathname])

  return (
    <ProSidebar
      className={classes.root}
      breakPoint="md"
      toggled={sidebarToggled}>
      <SidebarContent ref={wrapperRef} className={classes.content}>
        <div className={classes.space} />
        <Menu>
          <SubHeader className={classes.subHeader}>{labels.SideBar.salesPipeline}</SubHeader>
          <EnhancedMenuItem
            icon={<BsFillPersonLinesFill />}
            linkTo="/customers">
            {labels.SideBar.customer}
          </EnhancedMenuItem>
          {
            isAdmin ?
              <SubMenu title="Reports" icon={<FaChartLine />} className={classes.subMenu}
                onClick={() => setOpen(!open)}
                open={open}>
                <EnhancedMenuItem
                  className={classes.subMenuItem}
                  linkTo="/reports/sales">
                  {labels.SideBar.sales}
                </EnhancedMenuItem>
                <EnhancedMenuItem
                  className={classes.subMenuItem}
                  linkTo="/reports/customer">
                  {labels.SideBar.customerReport}
                </EnhancedMenuItem>
              </SubMenu>
              : <></>
          }
          {
            isAdmin ?
              <SubHeader className={classes.subHeader}>{labels.SideBar.manage}</SubHeader>
              : <></>
          }
          {
            isAdmin ?
              <EnhancedMenuItem
                icon={<FiShoppingBag />}
                linkTo="/contracts">
                {labels.SideBar.deals}
              </EnhancedMenuItem>
              : <></>
          }
        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
}