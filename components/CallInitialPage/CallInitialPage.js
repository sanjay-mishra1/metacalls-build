import {
  faDesktop,
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { createRoom } from "../../server/firebase";
import { generateUniqueId, getUserStream } from "../../util/helper";
import Header from "../UI/Header/Header";
import style from "./CallInitialPage.module.scss";
import { withWidth } from "@material-ui/core";
function CallInitialPage(props) {
  const [config, setConfig] = React.useState({
    video: true,
    mic: true,
    screen: false,
  });
  const startCall = () => {
    let roomId = generateUniqueId();
    createRoom(roomId);
    window.location.href =
      "/meet/" + roomId + "?video=" + config.video + "&audio=" + config.mic;
  };
  const shareScreen = () => {
    let roomId = generateUniqueId();
    createRoom(roomId);
    window.location.href = "/meet/" + roomId + "?screen=" + true;
  };
  React.useEffect(() => {
    init();
  }, [config]);
  const init = async () => {
    let ref = document.getElementById("user-video");
    try {
      let stream = await getUserStream(false, config.video);
      ref.srcObject = stream;
    } catch (error) {
      ref.srcObject = null;
    }
  };
  const videoPreview = (
    <div className={style.right_side}>
      <div
        className={style.content}
        style={{
          background: "black",
          border: "1px solid black",
          padding: 0,
          paddingBottom: 37,
        }}
      >
        <video
          className={style.iframe_container}
          id="user-video"
          autoPlay
          playsInline
          style={
            props.width === "xs" || props.width === "sm"
              ? {
                  width: "100%",
                  height: "inherit",
                  borderRadius: 0,
                  objectFit: "scale-down",
                }
              : { objectFit: "scale-down" }
          }
          poster="https://img.icons8.com/ios-filled/50/ffffff/no-video--v1.png"
        ></video>
        <div
          className="footer-item"
          style={{
            position: "relative",
            height: 0,
          }}
        >
          <div className="center-item">
            <div
              style={{ border: 0 }}
              data-tip={config.mic ? "Mute Audio" : "Unmute Audio"}
              className={`icon-block ${config.mic ? "red-bg" : null}`}
              onClick={() => setConfig({ ...config, mic: !config.mic })}
            >
              <FontAwesomeIcon
                className="icon"
                icon={config.mic ? faMicrophone : faMicrophoneSlash}
              />
            </div>

            <div
              style={{ border: 0 }}
              className={`icon-block ${config.video ? "red-bg" : null}`}
              onClick={() => setConfig({ ...config, video: !config.video })}
            >
              <FontAwesomeIcon
                className="icon"
                icon={config.video ? faVideo : faVideoSlash}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className={style.home_page}>
      <Header user={props.user} logout={props.logout} />
      <div
        className={style.body}
        style={
          props.width === "sm" || props.width === "xs"
            ? { display: "block", alignSelf: "center" }
            : null
        }
      >
        {props.width === "sm" || props.width === "xs" ? videoPreview : null}
        <div className={style.left_side}>
          <div className={style.content}>
            {props.width !== "sm" && props.width !== "xs" ? (
              <>
                <h2>Premium video meeting. Now free for everyone.</h2>
                <p>
                  We re-engineered the service we built for secure business
                  meetings, Meta Calls to make it free and available for all.
                </p>
              </>
            ) : null}
            <div
              className={style.action_btn}
              style={{ justifyContent: "flex-start" }}
            >
              <button onClick={startCall} className={`${style.btn} green`}>
                <FontAwesomeIcon className={style.icon_block} icon={faVideo} />
                Start Meeting
              </button>
              <button className={style.btn} onClick={shareScreen}>
                <FontAwesomeIcon
                  className={style.icon_block}
                  icon={faDesktop}
                />
                Share Screen
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className={style.btn}
              >
                Cancel
              </button>
            </div>
          </div>
          <div className={style.help_text}>
            <a href="">Learn more</a> about MetaCalls
          </div>
        </div>
        {props.width !== "sm" && props.width !== "xs" ? videoPreview : null}
      </div>
    </div>
  );
}
export default withWidth()(CallInitialPage);
