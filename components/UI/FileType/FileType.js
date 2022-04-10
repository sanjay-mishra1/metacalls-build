import React from "react";
import { formatDate } from "../../../util/helper";
import style from "./FileType.module.scss";
// import fileIcon from "../../../media/fileIcon.svg";
export default function FileComp({ file }) {
  const { fileName, fileType, fileSize, timestamp, username, fileUrl } = file;
  const downloadFile = () => {
    var link = document.createElement("a");
    link.download = fileName;
    link.href = fileUrl;
    link.target = "_blank";
    link.click();
  };
  return (
    <div key={timestamp} onClick={downloadFile} className={style.file_block}>
      <CustomFileType
        fileType={fileType}
        fileName={fileName}
        fileUrl={fileUrl}
      />
      <div className={style.file_info_body}>
        <div className={style.file_info}>
          <div>{fileName}</div> <small>{formatDate(timestamp)}</small>
        </div>
        <div className={style.file_info}>
          <div className={style.username}>
            By <b>{username}</b>
          </div>
          <small>{fileSize / 1000} KB</small>
        </div>
      </div>
    </div>
  );
}
const CustomFileType = ({ fileName, fileType, fileUrl }) => {
  return (
    <>
      {["jpeg", "svg", "png", "giff"].includes(fileType) ? (
        <img className={style.file_image} src={fileUrl} alt={fileName} />
      ) : (
        <div className={style.file}>
          <img style={{ width: 50 }} src={"/fileIcon.svg"} alt="file" />
          <p className={style.fileIcon}>
            {fileType.length > 4 ? fileType.substring(0, 4) : fileType}
          </p>
        </div>
      )}
    </>
  );
};
