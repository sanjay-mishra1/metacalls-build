import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faExclamationCircle,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/dist/client/image";
import style from "./Header.module.css";
import { useSession, signOut } from "next-auth/client";
import { Tooltip } from "@material-ui/core";
function Header({ user, logout }) {
  const [session] = useSession();
  console.log("header session", session);
  const handleLogout = () => {
    if (session) signOut();
    else logout();
    window.location.href = "/";
  };
  const openHome = () => {
    window.location.href = "/";
  };
  return (
    <div className={style.header}>
      <div className={style.logo} onClick={openHome}>
        <img src="/app.png" alt="MetaCalls" />
        <span className={style.helpText}>MetaCalls</span>
      </div>
      <div className={style.actionBtn}>
        {/* <FontAwesomeIcon className={style.iconBlock} icon={faQuestionCircle} />
        <FontAwesomeIcon
          className={style.iconBlock}
          icon={faExclamationCircle}
        /> */}
        {session || user ? (
          <>
            <Tooltip
              title={`${session ? session.user.name : user.name} (Logout)`}
            >
              <img
                className={style.profile_image}
                src={session ? session.user.image : user.image}
                alt={session ? session.user.name : user.name}
                width={30}
                onClick={handleLogout}
                height={30}
              />
            </Tooltip>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Header;
