import React, { useRef, useEffect, useState } from "react";
import Participants from "../Participants/Participants.component";
import style from "./MainScreen.module.css";
import { connect } from "react-redux";
import { setMainStream, updateUser } from "../../store/actioncreator";
import CallPageFooter from "../UI/CallPageFooter/CallPageFooter";
import MeetingInfo from "../UI/MeetingInfo/MeetingInfo";
import Messenger from "../UI/Messenger/Messenger";
import CallPageHeader from "../UI/CallPageHeader/CallPageHeader";
import { db, uid, userName } from "../../server/firebase";
import { generateUniqueId } from "../../util/helper";
import EmojiViewer from "../UI/EmojiViwer/EmojiViewer";
import { withWidth } from "@material-ui/core";

const MainScreen = (props) => {
  const {
    messageList,
    attachmentList,
    settings,
    currentUserDBId,
    emojiList,
    participantsStatusList,
    showError,
    width,
  } = props;
  const participantRef = useRef(props.participants);
  const firebaseChatRef = db.database().ref().child(props.roomId).child("data");
  const [mediaTrack, setMediaTrack] = React.useState(null);
  const [meetInfoPopup, setMeetInfoPopup] = React.useState(true);
  const [isMessenger, setIsMessenger] = useState(false);
  const [messageAlert, setMessageAlert] = useState({});
  const [tabIndex, setTabIndex] = useState(0);
  console.log(props);
  const onMicClick = (micEnabled) => {
    if (props.stream) {
      props.stream.getAudioTracks()[0].enabled = micEnabled;
      props.updateUser({ audio: micEnabled });
    }
  };
  const onVideoClick = (videoEnabled) => {
    if (props.stream) {
      props.stream.getVideoTracks()[0].enabled = videoEnabled;
      props.updateUser({ video: videoEnabled });
    }
  };
  useEffect(() => {
    if (props.configuration.screen) onScreenClick();
  }, [props.configuration]);
  useEffect(() => {
    participantRef.current = props.participants;
    try {
      if (
        props.currentUser[currentUserDBId].video !==
        participantRef.current[currentUserDBId].video
      ) {
        try {
          document.getElementById("video-item").click();
        } catch (error) {}
      }
      if (
        props.currentUser[currentUserDBId].audio !==
        participantRef.current[currentUserDBId].audio
      ) {
        try {
          document.getElementById("audio-item").click();
        } catch (error) {}
      }
      if (
        props.currentUser[currentUserDBId].screen !==
        participantRef.current[currentUserDBId].screen
      ) {
        try {
          document.getElementById("screen-item").click();
        } catch (error) {}
      }
    } catch (error) {}
    console.log(
      "Participants triggered",
      participantRef.current[currentUserDBId]
    );
  }, [props.participants]);

  const updateStream = (stream) => {
    for (let key in participantRef.current) {
      const sender = participantRef.current[key];
      if (sender.currentUser) continue;
      const peerConnection = sender.peerConnection
        .getSenders()
        .find((s) => (s.track ? s.track.kind === "video" : false));
      peerConnection.replaceTrack(stream.getVideoTracks()[0]);
    }
    props.setMainStream(stream);
  };

  const onScreenShareEnd = async () => {
    console.log("Closing screen share");
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    try {
      localStream.getVideoTracks()[0].enabled = Object.values(
        props.currentUser
      )[0].video;

      updateStream(localStream);
      mediaTrack.getTracks().forEach((track) => track.stop());
      setMediaTrack(null);
    } catch (error) {
      console.log(error);
    }
    props.updateUser({ screen: false });
  };

  const onScreenClick = async () => {
    let mediaStream;
    if (navigator.getDisplayMedia) {
      mediaStream = await navigator.getDisplayMedia({ video: true });
    } else if (navigator.mediaDevices.getDisplayMedia) {
      mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
    } else {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { mediaSource: "screen" },
      });
    }

    mediaStream.getVideoTracks()[0].onended = onScreenShareEnd;

    updateStream(mediaStream);
    setMediaTrack(mediaStream);
    props.updateUser({ screen: true });
  };
  const sendMsg = (msg) => {
    console.log("msg", msg);
    if (!msg) return;
    var message = {
      user: userName,
      timestamp: new Date().getTime(),
      message: msg,
    };
    firebaseChatRef
      .child("chat")
      .child(generateUniqueId())
      .set(message)
      .then((data) => {
        console.log("data stored", data);
      })
      .catch((err) => {
        console.log("error in storing the message", err);
      });
  };
  const participantsMapList =
    participantsStatusList && participantsStatusList.length > 0
      ? participantsStatusList.filter((item) => item.status === "waiting")
      : [];

  return (
    <div className={style.wrapper}>
      {settings && (
        <>
          <div className={style.main_screen}>
            <Participants />
          </div>
          <CallPageHeader
            isMessenger={isMessenger}
            setIsMessenger={setIsMessenger}
            messageAlert={messageAlert}
            roomId={props.roomId}
            setTabIndex={setTabIndex}
            width={width}
            participantsList={participantsMapList}
            meetingTime={settings["meetingTime"]}
            isAdmin={settings["admin"] === uid}
            totalUsers={Object.keys(props.participants).length}
            setMessageAlert={setMessageAlert}
          />
          <div className="footer">
            <CallPageFooter
              onScreenClick={onScreenClick}
              onMicClick={onMicClick}
              onVideoClick={onVideoClick}
              showError={showError}
              configuration={props.configuration}
              onScreenShareEnd={onScreenShareEnd}
              settings={settings}
              width={width}
              roomId={props.roomId}
              adminId={settings["admin"]}
              isAdmin={settings["admin"] === uid}
              showMeetingInfo={() => setMeetInfoPopup(true)}
            />
          </div>
          {settings["admin"] === uid && meetInfoPopup && (
            <MeetingInfo
              setMeetInfoPopup={setMeetInfoPopup}
              isAdmin={settings["admin"] === uid}
              url={window.location.origin + window.location.pathname}
            />
          )}
          {isMessenger && (
            <Messenger
              setIsMessenger={setIsMessenger}
              sendMsg={sendMsg}
              attachmentList={attachmentList}
              roomId={props.roomId}
              participants={props.participants}
              tabIndex={tabIndex}
              width={width}
              currentUserDBId={currentUserDBId}
              settings={settings}
              isAdmin={settings["admin"] === uid}
              totalUsers={Object.keys(props.participants).length}
              setTabIndex={setTabIndex}
              messageList={messageList}
              participantsStatusList={participantsMapList}
            />
          )}
          <EmojiViewer emoji={emojiList} />
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    stream: state.mainStream,
    participants: state.participants,
    currentUser: state.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMainStream: (stream) => dispatch(setMainStream(stream)),
    updateUser: (user) => dispatch(updateUser(user)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWidth()(MainScreen));
