import {
  Button,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  Typography,
} from "@material-ui/core";
import React from "react";
// import micIcon from "../../../media/microphone.png";
// import blockedVideo from "../../../media/blockedVideo.svg";

export default function ErrorDialog({ removeDialog, text }) {
  return (
    <Dialog open={true} onClose={removeDialog}>
      <div style={{ background: "#27273d", textAlign: "center" }}>
        <img
          src={"/microphone.png"}
          alt="Microphone"
          width={150}
          height={150}
        />
      </div>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Require Acess
        </Typography>
        <Typography variant="body2" color="text.secondary">
          MetaCalls requires access to your camera and microphone. Click the
          camera {"blocked icon "}
          <img
            alt=""
            aria-hidden="true"
            style={{ verticalAlign: "middle" }}
            src={"/blockedVideo.svg"}
          />
          {" in your browser's address bar."}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={removeDialog}>
          Dismiss
        </Button>
      </CardActions>
    </Dialog>
  );
}
