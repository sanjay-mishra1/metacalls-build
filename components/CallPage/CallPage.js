/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import MainScreen from "./../MainScreen/MainScreen.component";
import firepadRef, { db, uid, userName } from "./../../server/firebase";
import { useEffect } from "react";
import {
  setMainStream,
  addParticipant,
  setUser,
  removeParticipant,
  updateParticipant,
} from "../../store/actioncreator";
// import blockedVideo from "../../media/blockedVideo.svg";

import { connect } from "react-redux";
import CallInitialPage from "../CallInitialPage/CallInitialPage";
// import { useParams, useHistory } from "react-router-dom";
import { initRef } from "../../server/peerConnection";
import { getUserStream } from "../../util/helper";
import useDatabase from "../../hooks/useDatabase";
import { useState } from "react";
import ErrorDialog from "../UI/ErrorDialog/ErrorDialog";
import NoMatch from "../NoMatch/NoMatch";
// import micIcon from "../../media/microphone.png";

function CallPage(props) {
  // const history = useHistory();
  // const params = useParams();
  const [showCallPage, setShowCallPage] = React.useState(false);
  const [roomId, setRoomId] = React.useState(null);
  const [userDBId, setUserDBId] = useState();
  const [showError, setShowError] = useState(null);

  const [configuration, setConfiguration] = React.useState({
    mic: true,
    video: false,
    screen: false,
  });
  useEffect(() => {
    console.log("calling create room ", props);
    const roomId = props.roomId;
    if (roomId) {
      // createRoom(roomId);
      setRoomId(roomId);
      setShowCallPage(true);
      initRef(roomId);
    } else console.log("rommid not found");
  }, [props.roomId]);
  useEffect(async () => {
    const urlparams = new URLSearchParams(window.location.search);
    const audio = urlparams.get("audio");
    const video = urlparams.get("video");
    const screen = urlparams.get("screen");
    var config = {
      mic: audio !== undefined ? audio === "true" : true,
      video: video !== undefined ? video === "true" : false,
      screen: screen !== undefined ? screen === "true" : false,
    };
    props.router.push(window.location.pathname);
    console.log("Config", config);
    setConfiguration({ ...configuration, ...config });
    try {
      const stream = await getUserStream();
      // stream.getVideoTracks()[0].enabled = false;
      stream.getVideoTracks()[0].enabled = config.video;
      props.setMainStream(stream);
    } catch (error) {
      try {
        const stream = await getUserStream(true, false);
        console.log(error);
        props.setMainStream(stream);
      } catch (error) {
        setShowError("page");
        console.log(" both error ocurred", error);
      }
    }

    connectedRef.on("value", (snap) => {
      if (snap.val()) {
        const defaultPreference = {
          // audio: true,
          // video: false,
          ...configuration,
          ...config,
        };
        console.log("default pref", defaultPreference);
        const userStatusRef = participantRef.push({
          userName,
          uid: uid,
          preferences: defaultPreference,
        });
        console.log("pushed user", userStatusRef, userStatusRef.key);
        setUserDBId(userStatusRef.key);
        props.setUser({
          [userStatusRef.key]: {
            name: userName,
            uid: uid,
            ...defaultPreference,
          },
        });
        try {
          userStatusRef.onDisconnect().remove();
        } catch (error) {
          console.log("disconnet listener", error);
        }
      }
    });
  }, []);
  const connectedRef = db.database().ref(".info/connected");
  var participantRef = firepadRef.child(props.roomId).child("participants");

  const isUserSet = !!props.user;
  const isStreamSet = !!props.stream;
  const { docs, files, settings, emojiList, participantsStatus } = useDatabase(
    props.roomId
  );

  console.log("docs ", docs, files, "currentUser", userDBId);
  useEffect(() => {
    if (isStreamSet && isUserSet) {
      participantRef.on("child_added", (snap) => {
        const preferenceUpdateEvent = participantRef
          .child(snap.key)
          .child("preferences");
        preferenceUpdateEvent.on("child_changed", (preferenceSnap) => {
          props.updateParticipant({
            [snap.key]: {
              [preferenceSnap.key]: preferenceSnap.val(),
            },
          });
        });
        const { userName: name, uid, preferences = {} } = snap.val();
        props.addParticipant({
          [snap.key]: {
            name,
            uid,
            ...preferences,
          },
        });
      });
      participantRef.on("child_removed", (snap) => {
        props.removeParticipant(snap.key);
        if (snap.key === userDBId) {
          window.location.href = "/";
        }
        console.log("removed child", snap.val(), snap.key, "dbId", userDBId);
      });
    }
  }, [isStreamSet, isUserSet]);

  return (
    <>
      <div className="App">
        {showCallPage ? (
          showError === "page" ? (
            <NoMatch
              actionBtName="Retry"
              actionMethod={() => window.location.reload()}
              msg={
                <>
                  MetaCalls requires access to your camera and microphone. Click
                  the camera {"blocked icon "}
                  <img
                    alt=""
                    aria-hidden="true"
                    style={{ verticalAlign: "middle" }}
                    src="/blockedVideo.svg"
                  />
                  {" in your browser's address bar."}
                </>
              }
              customImage="/microphone.png"
            />
          ) : (
            <MainScreen
              roomId={roomId}
              attachmentList={files}
              configuration={configuration}
              messageList={docs}
              emojiList={emojiList}
              showError={setShowError}
              participantsStatusList={participantsStatus}
              settings={settings}
              currentUserDBId={userDBId}
            />
          )
        ) : (
          <CallInitialPage />
        )}
      </div>
      {showError && showError !== "page" && (
        <ErrorDialog removeDialog={() => setShowError(null)} />
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    stream: state.mainStream,
    user: state.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMainStream: (stream) => dispatch(setMainStream(stream)),
    addParticipant: (user) => dispatch(addParticipant(user)),
    setUser: (user) => dispatch(setUser(user)),
    removeParticipant: (userId) => dispatch(removeParticipant(userId)),
    updateParticipant: (user) => dispatch(updateParticipant(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CallPage);
