import { Button, IconButton, Snackbar } from "@material-ui/core";
import * as React from "react";

export default function AlertBox({
  message,
  primaryActionName,
  primaryAction,
  secondaryActionName,
  secondaryAction,
  onClose,
}) {
  const [open, setOpen] = React.useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    onClose();
  };
  const actionInitiator = (actionMethod) => {
    actionMethod();
    setOpen(false);
    onClose();
    console.log("close Method triggered");
  };
  const action = (
    <React.Fragment>
      {primaryAction && (
        <Button
          color="primary"
          size="small"
          onClick={() => actionInitiator(primaryAction)}
        >
          {primaryActionName}
        </Button>
      )}
      {secondaryAction && (
        <Button
          color="secondary"
          size="small"
          onClick={() => actionInitiator(secondaryAction)}
        >
          {secondaryActionName}
        </Button>
      )}
    </React.Fragment>
  );

  return (
    <Snackbar
      open={open}
      // autoHideDuration={6000}
      onClose={handleClose}
      message={message}
      color="white"
      style={{ bottom: 95 }}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      action={action}
    />
  );
}
