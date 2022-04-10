import React from "react";
import style from "./User.module.scss";
export default function User({ username, color, isAdmin, currentUser }) {
  return (
    <div className={style.user} style={{ width: "87%" }}>
      <div
        className={style.avatar}
        style={{
          background: color,
          placeContent: "center",
          alignItems: "center",
        }}
      >
        {username ? username[0] : ""}
      </div>
      <div style={{ marginLeft: 10 }} className={style.user_info_body}>
        <span
          style={{ display: "table", marginTop: !isAdmin ? 13 : 0 }}
          className={style.username}
        >
          {username}
          {currentUser && " (You)"}
        </span>
        {isAdmin && <small className={style.caption}>Organizer</small>}
      </div>
    </div>
  );
}
