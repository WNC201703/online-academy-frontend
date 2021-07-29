import { MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { React } from "react";
import { useLocation } from 'react-router-dom';

export default function EnhancedMenuItem({ linkTo, children, icon, ...props }) {
  const location = useLocation()
  return (
    <MenuItem 
      active={location.pathname.includes(linkTo)}
      icon={icon}
      {...props}>
      {children}
      <Link to={linkTo} />
    </MenuItem>
  )
}