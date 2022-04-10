import { faKeyboard, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Header from "../UI/Header/Header";
import style from "./HomePage.module.scss";

import JoinCall from "../JoinCall/JoinCall";
import { withWidth } from "@material-ui/core";
function HomePage(props) {
  const [roomId, setRoomId] = React.useState(null);
  // const history = useHistory();
  const startCall = () => {
    window.location.href = "/meet";
  };
  const joinCall = () => {
    try {
      console.log("joining call");
      let meet = document.getElementById("join-call-input").value;
      let roomId;
      console.log("meet link in homepage", meet);
      if (meet) {
        if (meet.startsWith(window.location.protocol)) {
          if (meet.includes(window.location.host)) {
            const urlparams = new URLSearchParams(new URL(meet).search);
            roomId = urlparams.get("id");
            console.log("room id", roomId);
          }
        } else roomId = meet;
        if (roomId) {
          setRoomId(roomId);
        } else console.log("Room id not found");
      }
    } catch (error) {}
  };
  return (
    <>
      <div className={style.homePage}>
        <Header />
        <div
          className={style.body}
          style={props.width === "xs" ? { display: "block" } : null}
        >
          {props.width === "xs" && (
            <div className={style.rightSide}>
              <div className={style.content}>
                <img
                  src="https://secure.skypeassets.com/content/dam/scom/home-new/hero-banner/3x3-tablet-min.png"
                  alt="video-call"
                />
              </div>
            </div>
          )}
          <div className={style.leftSide}>
            <div className={style.content}>
              <h2>Premium video meeting. Now free for everyone.</h2>
              <p>
                We re-engineered the service we built for secure business
                meetings, Meta Calls to make it free and available for all.
              </p>
              <div
                className={style.actionBtn}
                style={props.width === "xs" ? { display: "block" } : null}
              >
                <button onClick={startCall} className={`${style.btn} green`}>
                  <FontAwesomeIcon className={style.iconBlock} icon={faVideo} />
                  New Meeting
                </button>
                <div
                  className={style.inputBlock}
                  style={
                    props.width === "xs"
                      ? { marginLeft: 0, marginTop: 10 }
                      : null
                  }
                >
                  <div className={style.inputSection}>
                    <FontAwesomeIcon
                      className={style.iconBlock}
                      icon={faKeyboard}
                    />
                    <input
                      id="join-call-input"
                      placeholder="Enter a code or link"
                    />
                  </div>
                  <JoinCall
                    style={style}
                    roomId={roomId}
                    joinCallFn={joinCall}
                  />
                </div>
              </div>
            </div>
            <div className={style.helpText}>
              <a href="">Learn more</a> about MetaCalls
            </div>
          </div>
          {props.width !== "xs" && (
            <div className={style.rightSide}>
              <div className={style.content}>
                <img
                  src="https://secure.skypeassets.com/content/dam/scom/home-new/hero-banner/3x3-tablet-min.png"
                  alt="video-call"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default withWidth()(HomePage);
