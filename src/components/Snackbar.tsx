import React from "react";
import { Alert, Snackbar as SnackbarCommon } from "@mui/material";
import { Alert as AlertType } from "../context/SnackbarContext";

interface SnackbarProps {
  alert: AlertType,
	hideMessage: () => void,
}

const SNACKBAR_TIMEOUT = 5000;

const Snackbar: React.FC<SnackbarProps> = ({ alert, hideMessage }) => {
  if (alert.message === null || alert.message === '') return null;
  
  return (
    <SnackbarCommon
      open={alert.message !== null}
      autoHideDuration={SNACKBAR_TIMEOUT}
      onClose={hideMessage}
    >
      <Alert severity={alert.severity}>{alert.message ?? ""}</Alert>
    </SnackbarCommon>
  );
};

export default Snackbar;
