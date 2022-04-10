import React, { useEffect, useState } from "react";
import style from "./Messenger.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faUserFriends,
  faCommentAlt,
  faPaperPlane,
  faPaperclip,
  faPlus,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  formatDate,
  generateColor,
  scrollChatToBottom,
} from "../../../util/helper";
import User from "../User/User";
import { UseStorage } from "../../../hooks/useStorage";
import { Box, Divider, IconButton, styled, Tooltip } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import FileComp from "../FileType/FileType";
import { DISABLE_ATTACHMENT, DISABLE_CHAT } from "../../../util/constants";
import { acceptCallJoinRequest } from "../../../server/peerConnection";

const Messenger = ({
  setIsMessenger,
  sendMsg,
  messageList,
  tabIndex,
  setTabIndex,
  participants,
  totalUsers,
  attachmentList,
  roomId,
  settings,
  isAdmin,
  currentUserDBId,
  participantsStatusList,
  width,
}) => {
  const [msg, setMsg] = useState("");
  const [fileRef, setFileRef] = React.useState(null);

  const handleChangeMsg = (e) => {
    setMsg(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMsg(msg);
      setMsg("");
    }
  };

  const handleSendMsg = () => {
    sendMsg(msg);
    setMsg("");
  };
  const handleFile = (event, fileClick) => {
    try {
      event.preventDefault();
      let dt;
      if (!fileClick) dt = event.dataTransfer;
      else dt = event.target;
      let file = dt.files[0];
      let fileName = file.name;
      setFileFn({
        fileName: fileName.length > 20 ? fileName.substring(0, 20) : fileName,
        fileUrl: "",
        file,
        fileSize: file.size,
        timestamp: new Date().getTime(),
      });
    } catch (error) {}
  };
  // upload the file
  const setFileFn = (fileData) => {
    console.log("fileData", fileData);
    setFileRef(fileData);
  };
  console.log(participantsStatusList);
  return (
    <div
      className={style.messenger_container}
      style={
        width === "xs" ? { height: "100%", width: "100%", zIndex: 2 } : null
      }
    >
      <div className={style.messenger_header}>
        <h3>Meeting details</h3>
        <FontAwesomeIcon
          className={style.icon}
          icon={faTimes}
          onClick={() => {
            setIsMessenger(false);
          }}
        />
      </div>

      <div className={style.messenger_header_tabs}>
        <div
          className={`${style.tab} ${tabIndex === 0 ? style.active : ""}`}
          onClick={() => setTabIndex(0)}
        >
          <FontAwesomeIcon className={style.icon} icon={faUserFriends} />
          <p>People{totalUsers > 1 ? ` (${totalUsers - 1})` : ""}</p>
        </div>
        <div
          className={`${style.tab} ${tabIndex === 1 ? style.active : ""}`}
          onClick={() => setTabIndex(1)}
        >
          <FontAwesomeIcon className={style.icon} icon={faCommentAlt} />
          <p>Chat</p>
        </div>
        <div
          className={`${style.tab} ${tabIndex === 2 ? style.active : ""}`}
          onClick={() => setTabIndex(2)}
        >
          <FontAwesomeIcon className={style.icon} icon={faPaperclip} />
          <p>Attachment</p>
        </div>
      </div>
      {tabIndex === 0 && (
        <UserSection
          currentUserDBId={currentUserDBId}
          settings={settings}
          userList={participants}
          isAdmin={isAdmin}
          roomId={roomId}
          participantsStatusList={participantsStatusList}
        />
      )}

      {tabIndex === 1 && (
        <ChatSection
          handleChangeMsg={handleChangeMsg}
          handleKeyDown={handleKeyDown}
          handleSendMsg={handleSendMsg}
          allowMessage={isAdmin || !settings[DISABLE_CHAT]}
          messageList={messageList}
          msg={msg}
        />
      )}
      {tabIndex === 2 && (
        <AttachmentSection
          fileRef={fileRef}
          setFileRef={setFileRef}
          roomId={roomId}
          allowAttachment={isAdmin || !settings[DISABLE_ATTACHMENT]}
          handleFile={handleFile}
          attachmentList={attachmentList}
        />
      )}
    </div>
  );
};
const openFileSelector = () => {
  document.getElementById("file-input").click();
};
const AttachmentSection = ({
  attachmentList,
  handleFile,
  fileRef,
  setFileRef,
  roomId,
  allowAttachment,
}) => {
  console.log("file ref", fileRef);

  return (
    <>
      <div className={style.attach_section_top}>
        {!attachmentList || attachmentList.length === 0
          ? null
          : attachmentList.map((file, index) => {
              return <FileComp key={index} file={file} />;
            })}
        <div id="last"></div>
      </div>
      {allowAttachment && (
        <div
          className={style.attach_section}
          style={{ placeContent: "center", padding: 0 }}
        >
          {!fileRef ? (
            <div onClick={openFileSelector}>
              <input
                type="file"
                id="file-input"
                onChange={(e) => handleFile(e, true)}
                hidden="hidden"
              />
              <FontAwesomeIcon className={style.big_icon} icon={faPlus} />
              <p>Attach files</p>
            </div>
          ) : (
            <Progressbar file={fileRef} setFile={setFileRef} roomId={roomId} />
          )}
        </div>
      )}
    </>
  );
};

const UserSection = ({
  userList,
  settings,
  currentUserDBId,
  participantsStatusList,
  roomId,
  isAdmin,
}) => {
  console.log("participantsStatusList", participantsStatusList);
  return (
    <>
      <div className={style.chat_section}>
        {Object.keys(userList).map((userKey) => {
          let user = userList[userKey];

          return (
            <User
              key={userKey}
              username={user.name}
              color={user.avatarColor}
              isAdmin={settings["admin"] === user.uid}
              currentUser={userKey === currentUserDBId}
            />
          );
        })}
        {isAdmin && participantsStatusList.length > 0 && (
          <div>
            <Divider />
            {participantsStatusList.map((user) => (
              <div key={user.uid} style={{ display: "flex" }}>
                <User
                  username={user.name}
                  color={generateColor()}
                  isAdmin={settings["admin"] === user.uid}
                />
                <div style={{ marginTop: 13 }}>
                  <Tooltip title="Accept">
                    <IconButton
                      size="small"
                      onClick={() =>
                        acceptCallJoinRequest(roomId, user.uid, "allowed")
                      }
                    >
                      <FontAwesomeIcon
                        color="#4caf50"
                        size="sm"
                        icon={faCheck}
                      />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Denied">
                    <IconButton
                      size="small"
                      onClick={() =>
                        acceptCallJoinRequest(roomId, user.uid, "denied")
                      }
                    >
                      <FontAwesomeIcon
                        color="#ff1111"
                        size="sm"
                        icon={faTimes}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const ChatSection = ({
  messageList,
  msg,
  handleChangeMsg,
  handleKeyDown,
  handleSendMsg,
  allowMessage,
}) => {
  React.useEffect(() => {
    scrollChatToBottom();
  }, []);
  return (
    <>
      <div id="chat-section" className={style.chat_section}>
        {messageList.map((item) => (
          <div key={item.timestamp} className={style.chat_block}>
            <div className={style.sender}>
              {item.user} <small>{formatDate(item.timestamp)}</small>
            </div>
            <p className={style.msg}>{item.message}</p>
          </div>
        ))}
        <div id="last"></div>
      </div>

      {allowMessage && (
        <div className={style.send_msg_section}>
          <input
            placeholder="Send a message to everyone"
            value={msg}
            onChange={(e) => handleChangeMsg(e)}
            onKeyDown={(e) => handleKeyDown(e)}
          />
          <FontAwesomeIcon
            className={style.icon}
            icon={faPaperPlane}
            onClick={handleSendMsg}
          />
        </div>
      )}
    </>
  );
};

const Progressbar = ({ file, setFile, roomId }) => {
  let { url, progress } = UseStorage(file, roomId);
  console.log("progress", progress);
  useEffect(() => {
    if (url) {
      console.log("file uploaded", url);
      setFile(null);
    } else console.log("file not uploaded");
  }, [url, setFile]);
  if (file !== null && progress === 0) progress = 5;
  return (
    <>
      <Box sx={{ width: "100%", padding: 10 }}>
        <p>Uploading {file.fileName}</p>
        <BorderLinearProgress variant="determinate" value={progress} />
      </Box>
    </>
  );
};
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
}));

export default Messenger;
