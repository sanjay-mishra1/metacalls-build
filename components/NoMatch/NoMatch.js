import React from "react";
import style from "./NoMatch.module.scss";
import Header from "../UI/Header/Header";
import Link from "next/link";
import { CircularProgress } from "@material-ui/core";
export default function NoMatch({
  msg,
  actionBtName,
  actionMethod,
  showProgress,
  customImage,
}) {
  return (
    <div className={style.no_match}>
      <Header />
      {customImage && (
        <div style={{ textAlign: "center" }}>
          <img src={customImage} alt="Microphone" width={250} height={250} />
        </div>
      )}
      <div className={style.no_match__content}>
        <h2 className={style.actionBtn}>{msg ?? "Invalid video call name"}</h2>
        {actionMethod ? (
          <button className={`${style.btn} green`} onClick={actionMethod}>
            {actionBtName}
          </button>
        ) : (
          !showProgress && (
            <a className={`${style.btn} green`} href="/">
              Return to home screen
            </a>
          )
        )}
        {showProgress && <CircularProgress color="primary" />}
      </div>
    </div>
  );
}
