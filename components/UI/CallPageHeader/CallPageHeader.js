import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserFriends,
  faCommentAlt,
  faUserCircle,
  faPaperclip,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import style from "./CallPageHeader.module.scss";
import { getTimeDiff } from "../../../util/helper";
import { IconButton, Tooltip } from "@material-ui/core";
import { userImage } from "../../../server/firebase";
import AlertBox from "../AlertBox/AlertBox";
import { acceptCallJoinRequest } from "../../../server/peerConnection";
const CallPageHeader = ({
  isMessenger,
  setIsMessenger,
  messageAlert,
  setMessageAlert,
  setTabIndex,
  totalUsers,
  meetingTime,
  width,
  participantsList,
  roomId,
  isAdmin,
}) => {
  let interval = null;
  const [alertMessage, setAlertMessage] = useState(null);
  const [currentTime, setCurrentTime] = useState(() => {
    return getTimeDiff();
  });

  useEffect(() => {
    interval = setInterval(
      () => setCurrentTime(getTimeDiff(meetingTime)),
      1000
    );
    return () => {
      clearInterval(interval);
    };
  }, [meetingTime]);

  useEffect(() => {
    console.log("participants list in header", participantsList);
    if (participantsList.length > 0 && isAdmin) {
      let message = "";
      let primaryAction;
      let primaryActionName;
      let secondaryAction;
      let secondaryActionName;
      if (participantsList.length === 1) {
        message = participantsList[0].name + " is waiting to join";
        primaryActionName = "Accept";
        primaryAction = () => {
          acceptCallJoinRequest(roomId, participantsList[0].uid, "allowed");
          setAlertMessage(null);
        };
        secondaryActionName = "Deny";
        secondaryAction = () => {
          acceptCallJoinRequest(roomId, participantsList[0].uid, "denied");
          setAlertMessage(null);
        };
      } else {
        if (participantsList.length === 2)
          message = `${participantsList[0].name} and ${participantsList[1].name} are waiting to join`;
        else
          message = `${participantsList[0].name} and ${
            participantsList.length - 1
          } more are waiting to join`;
        primaryActionName = "Show";
        primaryAction = () => {
          setIsMessenger(true);
          setMessageAlert({});
          setTabIndex(0);
          setAlertMessage(null);
        };
      }
      setAlertMessage({
        message,
        secondaryAction,
        primaryAction,
        secondaryActionName,
        primaryActionName,
      });
    } else setAlertMessage(null);
  }, [participantsList]);

  const [checked, setChecked] = useState(false);
  const containerRef = useRef(null);
  const handleChange = () => {
    setChecked(!checked);
  };
  const getStyle = () => {
    if (width === "xs") return { width: checked ? "100%" : "auto" };
    else if (width === "sm") return { width: checked ? "350px" : "auto" };
    return null;
  };
  const view = (
    <>
      <div
        className={`${style.header_items} ${style.icon_block}`}
        onClick={() => {
          setIsMessenger(true);
          setMessageAlert({});
          setTabIndex(0);
        }}
      >
        <FontAwesomeIcon className={style.icon} icon={faUserFriends} />
        {totalUsers > 1 && (
          <span className={style.badge}>{totalUsers - 1}</span>
        )}
      </div>
      <div
        className={`${style.header_items} ${style.icon_block}`}
        onClick={() => {
          setIsMessenger(true);
          setMessageAlert({});
          setTabIndex(1);
        }}
      >
        <FontAwesomeIcon className={style.icon} icon={faCommentAlt} />
        {!isMessenger && messageAlert.alert && (
          <span className={style.alert_circle_icon}></span>
        )}
      </div>

      <div
        className={`${style.header_items} ${style.icon_block}`}
        onClick={() => {
          setIsMessenger(true);
          setMessageAlert({});
          setTabIndex(2);
        }}
      >
        <FontAwesomeIcon className={style.icon} icon={faPaperclip} />
      </div>
      <div className={`${style.header_items} ${style.date_block}`}>
        {!currentTime.includes("NaNInvalid") ? currentTime : ""}
      </div>
    </>
  );
  return (
    <>
      <div className={style.frame_header} ref={containerRef} style={getStyle()}>
        {width !== "xs" && width !== "sm" && view}
        {width === "xs" || width === "sm" ? (
          <>
            <Tooltip title={checked ? "Collapse" : "Expand"}>
              <IconButton onClick={handleChange}>
                <FontAwesomeIcon
                  className={style.icon}
                  icon={checked ? faAngleRight : faAngleLeft}
                />
              </IconButton>
            </Tooltip>
            {checked ? view : null}
          </>
        ) : null}

        <div className={`${style.header_items} ${style.icon_block}`}>
          {userImage ? (
            <img
              className={`${style.icon} ${style.profile}`}
              src={userImage}
              style={{ borderRadius: "50%", width: 35 }}
              alt="user"
            />
          ) : (
            <FontAwesomeIcon
              className={`${style.icon} ${style.profile}`}
              icon={faUserCircle}
            />
          )}
        </div>
      </div>
      {alertMessage && !isMessenger && (
        <AlertBox {...alertMessage} onClose={() => setAlertMessage(null)} />
      )}
    </>
  );
};

export default CallPageHeader;
