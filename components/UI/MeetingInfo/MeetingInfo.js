import {
  faCopy,
  faShieldAlt,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { userName } from "../../../server/firebase";
import style from "./MeetingInfo.module.scss";
export default function MeetingInfo({ setMeetInfoPopup, url }) {
  const copyUrl = () => {
    navigator.clipboard.writeText(url);
  };
  return (
    <div className={style.meeting_info_block}>
      <div className={style.meeting_header}>
        <h3>Your meeting&apos;s ready</h3>
        <FontAwesomeIcon
          className={style.icon}
          onClick={(e) => setMeetInfoPopup(false)}
          icon={faTimes}
        />
      </div>

      <p>Share this meeting link with others you want in the meeting</p>
      <div className={style.meet_link}>
        <span>{url}</span>
        <FontAwesomeIcon
          style={{ paddingLeft: 4 }}
          onClick={copyUrl}
          className={style.icon}
          icon={faCopy}
        />
      </div>
      <div className={style.permission_text}>
        <FontAwesomeIcon className={style.icon} icon={faShieldAlt} />
        <p className={style.small_text}>
          People who use this meeting link must get your permission before they
          can join
        </p>
      </div>
      <p className={style.small_text}>Joined as {userName}</p>
    </div>
  );
}
