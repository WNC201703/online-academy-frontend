import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {useSnackbar} from "notistack";
import {SnackBarVariant} from "../utils/constant";

export const SamplePage = (props) => {
  const {enqueueSnackbar} = useSnackbar();

  const handleSuccessButtonClick = () => {
    enqueueSnackbar("This is a warning message", {variant: SnackBarVariant.Success});
  }
  const handleWarningButtonClick = () => {
    enqueueSnackbar("This is a warning message", {variant: SnackBarVariant.Warning});
  }
  const handleErrorButtonClick = () => {
    enqueueSnackbar("This is a warning message", {variant: SnackBarVariant.Error});
  }

  return <Box>
    This is home page
    <Button
      onClick={handleSuccessButtonClick}
      variant="contained" color="primary">
      Show success message
    </Button>
    <Button
      onClick={handleErrorButtonClick}
      variant="contained" color="primary">
      Show error message
    </Button>
    <Button
      onClick={handleWarningButtonClick}
      variant="contained" color="primary">
      Show warning message
    </Button>
  </Box>
}