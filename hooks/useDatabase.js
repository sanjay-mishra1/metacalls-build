import { useState, useEffect } from "react";
import { db } from "../server/firebase";
import { userName } from "../server/firebase";
import {
  deleteArrayElement,
  findObj,
  isAtBottom,
  scrollChatToBottom,
} from "../util/helper";
const useDatabase = (docId) => {
  const [docs, setDocs] = useState([]);
  const [files, setFiles] = useState([]);
  const [settings, setSettings] = useState([]);
  const [emojiList, setEmojiList] = useState([]);
  const [participantsStatus, setParticipantsStatus] = useState([]);

  useEffect(() => {
    let uid = userName;
    if (!uid) return null;
    var dbDoc;

    dbDoc = db.database().ref().child(docId).child("data");
    try {
      var unsub1;
      var unsub2;
      unsub1 = dbDoc
        .child("chat")
        .on("child_added", (snapshot, prevChildKey) => {
          const newPost = snapshot.val();
          console.log("existing docs are", docs);
          docs.push(newPost);
          setDocs([...docs]);
          if (isAtBottom("chat-section")) {
            scrollChatToBottom(true);
            console.log("chat at bottom");
          } else console.log("chat not at bottom");
        });
      unsub2 = dbDoc
        .child("files")
        .on("child_added", (snapshot, prevChildKey) => {
          const newPost = snapshot.val();
          console.log("existing docs are", docs);
          files.push(newPost);
          setFiles([...files]);
          if (isAtBottom("chat-section")) {
            scrollChatToBottom(true);
            console.log("chat at bottom");
          } else console.log("chat not at bottom");
        });

      var unsub3 = dbDoc
        .child("files")
        .on("child_removed", (snapshot, prevChildKey) => {
          const newPost = snapshot.val();
          console.log("deleted docs is", newPost);
          let list = deleteArrayElement(
            files,
            findObj(newPost.fileUrl, files, "fileUrl")
          );

          setFiles([...list]);
        });
      var unsub4 = dbDoc.child("settings").on("value", function (dataSnapshot) {
        console.log("settings page", dataSnapshot.val());
        setSettings(dataSnapshot.val());
      });

      const unsub5 = dbDoc
        .child("emoji")
        .on("child_added", (snapshot, prevChildKey) => {
          const newPost = snapshot.val();
          snapshot.ref.remove();
          console.log("existing docs are", docs);
          emojiList.push({ ...newPost, key: snapshot.key });
          setEmojiList([...emojiList]);
        });
      const unsub6 = dbDoc
        .child("participants-status")
        .on("value", function (dataSnapshot) {
          let temp = [];

          if (dataSnapshot.val()) {
            Object.keys(dataSnapshot.val()).forEach((key) => {
              temp.push(dataSnapshot.val()[key]);
            });
          }
          setParticipantsStatus(temp);
        });

      dbDoc.once("value", (snapshot) => {
        let docList = [];
        let val = snapshot.val();
        try {
          if (val.chat)
            val.chat.forEach((doc) => {
              console.log(doc.val());
              docList.push(doc.val());
            });
          console.log("once data", snapshot.val());
          setDocs(docList);
        } catch (error) {}
        try {
          let fileList = [];
          if (val.files)
            val.files.forEach((doc) => {
              console.log(doc.val());
              fileList.push(doc.val());
            });
          setFiles(fileList);
        } catch (error) {}
      });

      return () => {
        try {
          unsub1();
          unsub2();
          unsub3();
          unsub4();
          unsub5();
          unsub6();
        } catch (error) {}
      };
    } catch (error) {
      console.log(error);
    }
  }, [userName, docId]);
  return { docs, files, settings, emojiList, participantsStatus };
};

export default useDatabase;
