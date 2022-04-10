import React from "react";
import { checkMeetingLink } from "../../server/peerConnection";
import Button from "@material-ui/core/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
export default function JoinCall({ roomId, joinCallFn, style }) {
  const [joinCall, setJoinCall] = React.useState({ status: -1, msg: "" });
  React.useEffect(() => {
    if (roomId) checkLink();
  }, [roomId]);
  const checkLink = () => {
    checkMeetingLink(roomId, checkResult);
  };
  const checkResult = (status) => {
    if (status === null) return;

    if (status === 200) {
      setJoinCall({ status: 200, msg: null });
      let route = window.location.origin + "/meet?id=" + roomId;
      console.log("route", route, window.location.origin);
      window.location.href = route;
    } else setJoinCall({ status: 404, msg: "Meeting link not found" });
  };
  const initiateRoomIdCheck = () => {
    try {
      let meet = document.getElementById("join-call-input").value;
      if (!meet) return;
      setJoinCall({ status: 100 });
      joinCallFn();
    } catch (error) {}
  };
  console.log("Join call state", joinCall);
  return (
    <>
      {joinCall.status !== -1 ? (
        <Button variant="primary" disabled>
          <span className={style.visuallyHidden}>Loading...</span>
        </Button>
      ) : (
        <button
          onClick={initiateRoomIdCheck}
          className={`${style.btn} ${style.noBg}`}
        >
          Join
        </button>
      )}

      <Dialog
        open={joinCall.status === 404}
        onClose={() => setJoinCall({ found: -1, msg: "" })}
      >
        <DialogTitle>Meeting link not found</DialogTitle>
        <DialogContent>
          Provided link is not found. Below are the possibilities:
          <br></br>
          <ul>
            <li>Meeting link is invalid</li>
            <li> Meeting is ended.</li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button
            variant="secondary"
            onClick={() => setJoinCall({ status: -1, msg: "" })}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
