import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faMicrophone,
  faPhone,
  faAngleUp,
  faDesktop,
  faMicrophoneSlash,
  faVideoSlash,
  faCog,
  faLock,
  faTimes,
  faSmile,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
// import "./CallPageFooter.scss";
import { useEffect, useState } from "react";
import {
  ALLOW_ANYONE,
  ALLOW_AUDIO,
  ALLOW_SCREEN,
  ALLOW_VIDEO,
  DISABLE_ATTACHMENT,
  DISABLE_CHAT,
} from "../../../util/constants";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import SwitchView from "../SwitchView/SwitchView";
import {
  disableAllMedia,
  removeCall,
  storeEmoji,
  storeSettings,
} from "../../../server/peerConnection";

import React from "react";
import { getStorageUrl } from "../../../util/helper";
const CallPageFooter = (props) => {
  const [isSmall, setIsSmall] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [showEndCall, setShowEndCall] = useState(false);
  const [streamState, setStreamState] = useState(
    props.configuration ?? {
      mic: true,
      video: false,
      screen: false,
    }
  );
  const micClick = () => {
    setStreamState((currentState) => {
      return {
        ...currentState,
        mic: !currentState.mic,
      };
    });
  };

  const onVideoClick = () => {
    setStreamState((currentState) => {
      return {
        ...currentState,
        video: !currentState.video,
      };
    });
  };

  const onScreenClick = () => {
    props.onScreenClick(setScreenState(!streamState.screen));
  };

  const setScreenState = (isEnabled) => {
    setStreamState((currentState) => {
      return {
        ...currentState,
        screen: isEnabled,
      };
    });
  };
  useEffect(() => {
    try {
      if (window.location !== window.parent.location) {
        setIsSmall(true);
      } else {
        // The page is not in an iframe
        setIsSmall(false);
      }

      props.onMicClick(streamState.mic);
    } catch (error) {
      setStreamState({ ...streamState, audio: false, mic: false });
      console.error(error);
      props.showError("audio");
    }
  }, [streamState.mic]);
  useEffect(() => {
    try {
      props.onVideoClick(streamState.video);
    } catch (error) {
      console.error(error);
      setStreamState({ ...streamState, video: false });
      props.showError("video");
    }
  }, [streamState.video]);

  const stopScreenShare = () => {
    props.onScreenShareEnd(setScreenState(false));
  };

  const disconnectCall = () => {
    if (props.isAdmin) setShowEndCall(true);
    else window.location.href = "/";
  };
  console.log("settings", props.settings);
  return (
    <>
      <div className="footer-item">
        {!isSmall ? (
          <>
            {props.width !== "xs" && props.width !== "sm" && (
              <div className="left-item">
                {props.isAdmin && (
                  <div className="icon-block" onClick={props.showMeetingInfo}>
                    Meeting details
                    <FontAwesomeIcon className="icon" icon={faAngleUp} />
                  </div>
                )}
              </div>
            )}
          </>
        ) : null}

        <div className="center-item">
          <div
            id="audio-item"
            data-tip={streamState.mic ? "Mute Audio" : "Unmute Audio"}
            className={`icon-block ${streamState.mic ? "red-bg" : null}`}
            onClick={
              props.settings && !props.isAdmin && props.settings[ALLOW_AUDIO]
                ? null
                : micClick
            }
          >
            <FontAwesomeIcon
              className="icon"
              icon={streamState.mic ? faMicrophone : faMicrophoneSlash}
            />
            {props.settings[ALLOW_AUDIO]}
            {props.settings[ALLOW_AUDIO] && !props.isAdmin && <LockUI />}
          </div>
          {!isSmall && (
            <div
              className="icon-block"
              style={{ transform: "rotate(226deg)" }}
              onClick={disconnectCall}
            >
              <FontAwesomeIcon
                rotate="180"
                className="icon red"
                icon={faPhone}
              />
            </div>
          )}
          <div
            id="video-item"
            className={`icon-block ${streamState.video ? "red-bg" : null}`}
            onClick={
              props.settings && !props.isAdmin && props.settings[ALLOW_VIDEO]
                ? null
                : onVideoClick
            }
          >
            <FontAwesomeIcon
              className="icon"
              icon={streamState.video ? faVideo : faVideoSlash}
            />
            {props.settings[ALLOW_VIDEO] && !props.isAdmin && <LockUI />}
          </div>
          {props.width === "xs" || props.width === "sm" ? (
            <div
              id="screen-item"
              className={`icon-block ${streamState.screen ? "red-bg" : null}`}
              onClick={
                props.settings && !props.isAdmin && props.settings[ALLOW_VIDEO]
                  ? null
                  : streamState.screen
                  ? stopScreenShare
                  : onScreenClick
              }
            >
              <FontAwesomeIcon className="icon" icon={faDesktop} />
              {props.settings[ALLOW_SCREEN] && !props.isAdmin && <LockUI />}
            </div>
          ) : null}
        </div>
        {!isSmall && (
          <>
            {props.width !== "xs" && props.width !== "sm" ? (
              <div className="right-item">
                <EmojiMenuBar roomId={props.roomId} />
                {props.isAdmin && (
                  <div
                    onClick={() => setOpenSettings(!openSettings)}
                    className="icon-block"
                  >
                    <FontAwesomeIcon className="icon red" icon={faCog} />
                    <p className="title">Call Settings</p>
                  </div>
                )}

                {streamState.screen ? (
                  <div
                    id="screen-item"
                    className="icon-block"
                    onClick={stopScreenShare}
                  >
                    <FontAwesomeIcon className="icon red" icon={faDesktop} />
                    <p className="title">Stop presenting</p>
                  </div>
                ) : (
                  <div
                    className="icon-block"
                    onClick={
                      props.settings &&
                      !props.isAdmin &&
                      props.settings[ALLOW_SCREEN]
                        ? null
                        : onScreenClick
                    }
                  >
                    <FontAwesomeIcon className="icon red" icon={faDesktop} />
                    {props.settings[ALLOW_SCREEN] && !props.isAdmin && (
                      <LockUI />
                    )}
                    <p className="title">Present now</p>
                  </div>
                )}
              </div>
            ) : (
              <SmallScreenMenuBar
                openMeetingInfo={props.showMeetingInfo}
                roomId={props.roomId}
                openSettings={() => setOpenSettings(!openSettings)}
              />
            )}
          </>
        )}
      </div>
      {openSettings && (
        <AdminCallSettings
          settings={props.settings}
          roomId={props.roomId}
          adminId={props.adminId}
          closeDialog={() => setOpenSettings(false)}
        />
      )}
      {showEndCall && (
        <EndCall
          width={props.width}
          closeDialog={() => setShowEndCall(false)}
          roomId={props.roomId}
        />
      )}
    </>
  );
};

const LockUI = () => {
  return (
    <div className="icon-fixed-top">
      <FontAwesomeIcon
        style={{ fontSize: 14 }}
        className="icon"
        icon={faLock}
      />
    </div>
  );
};
const EndCall = ({ closeDialog, roomId, width }) => {
  const endCall = () => {
    window.location.href = "/";
  };
  const endCallAll = () => {
    removeCall(roomId);
    window.location.href = "/";
  };
  return (
    <Dialog open={true} onClose={closeDialog} maxWidth="sm">
      <div style={{ display: "flex", minWidth: "32em" }}>
        <DialogContent>
          <span style={{ color: "black" }}>End this call for everyone</span>
        </DialogContent>
        {width !== "xs" && width !== "sm" && (
          <IconButton onClick={closeDialog}>
            <FontAwesomeIcon className="icon " icon={faTimes} />
          </IconButton>
        )}
      </div>
      <DialogActions>
        <Button
          color="primary"
          onClick={endCall}
          style={{ textTransform: "none" }}
        >
          Leave the call
        </Button>
        <Button
          color="primary"
          onClick={endCallAll}
          style={{ textTransform: "none" }}
        >
          End the call
        </Button>
        <Button
          style={{ textTransform: "none" }}
          onClick={closeDialog}
          color="primary"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const AdminCallSettings = ({ roomId, settings, closeDialog, adminId }) => {
  const settingsList = [
    {
      label: "Disable video",
      helperText: "Disable users to start video",
      value: ALLOW_VIDEO,
    },
    {
      label: "Disable microphone",
      helperText: "Disable users to enable microphone",
      value: ALLOW_AUDIO,
    },
    {
      label: "Disable screen share",
      helperText: "Disable users to screen share",
      value: ALLOW_SCREEN,
    },
    {
      label: "Disable Chat",
      helperText: "Disable users to chat with each other",
      value: DISABLE_CHAT,
    },
    {
      label: "Disable Attachment",
      helperText: "Disable users to share files with each other",
      value: DISABLE_ATTACHMENT,
    },
    {
      label: "Ask permission",
      helperText: "Ask permission to join the call",
      value: ALLOW_ANYONE,
    },
  ];
  const handleSettings = (isChecked, value) => {
    let data = {};
    if (isChecked) {
      if (value === ALLOW_VIDEO) disableAllMedia("video", roomId, adminId);
      else if (value === ALLOW_AUDIO) disableAllMedia("audio", roomId, adminId);
      else if (value === ALLOW_SCREEN)
        disableAllMedia("screen", roomId, adminId);
      data[value] = true;
    } else data[value] = null;
    storeSettings(roomId, data);
  };
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={true}
      scroll="paper"
      onClose={closeDialog}
    >
      <DialogTitle>Settings</DialogTitle>
      <Divider />
      <DialogContent>
        <section>
          {settingsList.map((item) => (
            <SwitchView
              {...item}
              actionMethod={handleSettings}
              extraPropsForActionMethod={item.value}
              defaultChecked={settings[item.value]}
            />
          ))}
        </section>
      </DialogContent>
    </Dialog>
  );
};

function EmojiMenuBar({ roomId, customName }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const emojis = [
    {
      icon: "popper-staticsvg.svg",
      animate: "popperssvg.svg",
      name: "Celebrate",
    },
    {
      icon: "partying_face-static.gif",
      animate: "partying_face.gif",
      name: "Celebrating face",
    },
    { icon: "clap-static.svg", animate: "clap-animate.svg", name: "Clap" },
    { icon: "smile-static.svg", animate: "smile-animate.svg", name: "Smile" },
    { icon: "sad-static.svg", animate: "sad-animate.svg", name: "Sad" },
    { icon: "laugh.svg", animate: "laugh.-animate.svg", name: "Laugh" },
    { icon: "hand-static.svg", animate: "hand-animate.svg", name: "Thumbs up" },
    {
      icon: "down-static.svg",
      animate: "down-animate.svg",
      name: "Thumbs down",
    },
    {
      icon: "surprise.-static.svg",
      animate: "surprise.-animate.svg",
      name: "Surprise",
    },
  ];
  return (
    <>
      <div
        onClick={handleClick}
        className="icon-block"
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <FontAwesomeIcon className="icon red" icon={faSmile} />
        {customName ? customName : <p className="title">Emoji</p>}
      </div>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Grid container>
          {emojis.map((item, index) => (
            <Grid
              key={index}
              className="emoji"
              item
              onClick={() => storeEmoji(item.animate, roomId)}
              style={{ width: 30, margin: 4, height: 30 }}
            >
              <img
                className="img-main"
                src={getStorageUrl("MetaCalls-assets", item.icon)}
                alt={item.name}
              />
              <img
                src={getStorageUrl("MetaCalls-assets", item.animate)}
                className="img-top"
                alt={item.name}
              />
            </Grid>
          ))}
        </Grid>
      </Menu>
    </>
  );
}

function SmallScreenMenuBar({ openSettings, openMeetingInfo, roomId }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (type) => {
    if (type === "settings") openSettings();
    else if (type === "details") openMeetingInfo();
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <FontAwesomeIcon className="icon red" icon={faAngleUp} />
      </IconButton>

      <Menu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
      >
        <MenuItem onClick={() => handleClose("details")} disableRipple>
          <FontAwesomeIcon icon={faInfoCircle} />
          <span style={{ marginLeft: 10 }}>Meeting details</span>
        </MenuItem>
        <MenuItem onClick={() => handleClose("settings")} disableRipple>
          <FontAwesomeIcon icon={faCog} />
          <span style={{ marginLeft: 10 }}>Settings</span>
        </MenuItem>
        <MenuItem disableRipple>
          <EmojiMenuBar
            roomId={roomId}
            customName={<span style={{ marginLeft: 10 }}>Emoji</span>}
          />
        </MenuItem>
      </Menu>
    </>
  );
}

export default CallPageFooter;
