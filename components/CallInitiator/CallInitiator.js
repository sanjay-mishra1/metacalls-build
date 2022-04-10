import { CircularProgress } from "@material-ui/core";
import React from "react";
import {
  checkMeetingLink,
  removeActiveSession,
  requestJoiningCall,
} from "../../server/peerConnection";
import { setUserGlobalInfo } from "../../util/helper";
import CallPage from "../CallPage/CallPage";
import NoMatch from "../NoMatch/NoMatch";
import Header from "../UI/Header/Header";
import style from "./CallInitiator.module.scss";

export default function CallInitiator({ roomId, router, session }) {
  const [status, setStatus] = React.useState(-1);
  setUserGlobalInfo(session.user);
  React.useEffect(() => {
    if (roomId) checkMeetingLink(roomId, handleResponse);
  }, [roomId]);
  const handleResponse = (status) => {
    console.log("status received", status);
    if (status === null) return;
    else setStatus(status);
  };
  const removeSession = () => {
    console.log("remove session");
    removeActiveSession(roomId, status);
    window.location.reload();
  };
  const requestJoining = () => {
    requestJoiningCall(roomId);
  };
  const getUI = (status) => {
    switch (status) {
      case -1:
        return (
          <>
            <Header />
            <div className={style.main}>
              <CircularProgress color="primary" />
              <h2>Creating room, please wait</h2>
            </div>
          </>
        );
      case 404:
        return <NoMatch />;
      case 500:
        return (
          <NoMatch
            msg="Owner has denied your request of joining the call. Please contact the owner of the call to allow you into this call."
            actionBtName="Request Again"
            actionMethod={requestJoining}
          />
        );
      case 501:
        return (
          <NoMatch
            msg="Waiting for the owner to accept you into the call."
            showProgress
          />
        );
      case 200:
        return <CallPage router={router} roomId={roomId} />;
      default:
        return (
          <NoMatch
            msg="You already have an active session in this call. Please close the session and refresh this page"
            actionBtName="Start now"
            actionMethod={removeSession}
          />
        );
    }
  };
  return <>{getUI(status)}</>;
}
