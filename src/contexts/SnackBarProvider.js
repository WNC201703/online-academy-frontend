import Slide from "@material-ui/core/Slide";
import {SnackbarProvider} from "notistack";
import React from "react";

export default function AppSnackbarProvider({children}) {
  return (
    <SnackbarProvider
      maxSnack={5}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      TransitionComponent={Slide}>
      {children}
    </SnackbarProvider>
  )
}