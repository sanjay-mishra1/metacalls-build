import React from "react";
import Card from "../../Card/Card.component";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./Participant.module.css";

export const Participant = (props) => {
  const {
    curentIndex,
    currentParticipant,
    hideVideo,
    videoRef,
    showAvatar,
    currentUser,
  } = props;
  if (!currentParticipant) return <></>;
  return (
    <div className={`${style.participant} ${hideVideo ? style.hide : ""}`}>
      <Card>
        <video
          ref={videoRef}
          className={style.video}
          id={`participantVideo${curentIndex}`}
          autoPlay
          playsInline
        ></video>
        {!currentParticipant.audio && (
          <FontAwesomeIcon
            className={style.muted}
            icon={faMicrophoneSlash}
            title="Muted"
          />
        )}
        {showAvatar && (
          <div
            style={{ background: currentParticipant.avatarColor }}
            className={style.avatar}
          >
            {currentParticipant.name[0]}
          </div>
        )}
        <div className={style.name}>
          {currentParticipant.name}
          {currentUser ? "(You)" : ""}
        </div>
      </Card>
    </div>
  );
};
