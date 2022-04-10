import { randomBytes } from "crypto";
import moment from "moment";
export const setUserGlobalInfo = (user) => {
  console.log("setting user info", user);
  if (typeof window !== "undefined") {
    localStorage.setItem("uid", user.email);
    localStorage.setItem("userName", user.name);

    localStorage.setItem("userImage", user.image);
  }
};
export const formatUserId = (userid) => {
  if (!userid) return userid;
  //".", "#", "$", "[", or "]"
  return userid
    .replaceAll(".", "1")
    .replaceAll("#", "2")
    .replaceAll("$", "3")
    .replaceAll("[", "4".replaceAll("]", "5"));
};
export const getTimeDiff = (timestamp) => {
  //
  var now = new Date();
  var then = new Date(timestamp);

  var ms = moment(now, "DD/MM/YYYY HH:mm:ss").diff(
    moment(then, "DD/MM/YYYY HH:mm:ss")
  );
  var d = moment.duration(ms);
  var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

  return s;
};
export const formatDate = (timestamp) => {
  return moment(timestamp).format("hh:mm a");
};
export const generateColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);
export const generateUniqueId = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let autoId = "";
  while (autoId.length < 20) {
    const bytes = randomBytes(40);
    bytes.forEach((b) => {
      // Length of `chars` is 62. We only take bytes between 0 and 62*4-1
      // (both inclusive). The value is then evenly mapped to indices of `char`
      // via a modulo operation.
      const maxValue = 62 * 4 - 1;
      if (autoId.length < 20 && b <= maxValue) {
        autoId += chars.charAt(b % 62);
      }
    });
  }
  return autoId;
};
export const getUserStream = async (audio, video) => {
  const localStream = await navigator.mediaDevices.getUserMedia({
    audio: audio !== undefined ? audio : true,
    video: video !== undefined ? video : true,
  });

  return localStream;
};

export const isAtBottom = (id) => {
  try {
    return true;
    let elem = document.getElementById(id);
    return elem.scrollHeight - elem.scrollTop - elem.clientHeight === 0;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const scrollChatToBottom = (timeout) => {
  try {
    if (timeout) {
      console.log("scrolling to bottom");
      setTimeout(() => {
        try {
          document.getElementById("last").scrollIntoView();
        } catch (error) {
          console.log(error);
        }
      }, 100);
    } else document.getElementById("last").scrollIntoView();
  } catch (error) {
    console.log(error);
  }
};
export const getStorageUrl = (folderName, fileName) => {
  return `https://firebasestorage.googleapis.com/v0/b/meta-doc.appspot.com/o/${folderName}%2F${fileName}?alt=media&token=6aaf9fdc-f85a-4f50-9681-daf1b1b84079`;
};
export const fileTypeName = (name) => {
  console.log("file type", name);
  if (name.includes("sheet") || name.includes("excel")) return "xls";
  else if (name.includes("document")) return "doc";
  else if (name.includes("javascript")) return "js";
  else if (name.includes("x-msdownload")) return "exe";
  else if (name.includes("x-zip-compressed")) return "zip";
  else if (name.includes("plain")) return "txt";
  else if (name.includes("x-gzip")) return "tar";
  else if (name.includes("svg+xml")) return "svg";
  return name;
};
export const isNumber = (text, getMessage) => {
  text += "";
  let test = /^\d+$/.test(text);
  if (getMessage) return test ? null : "Only number is allowed";
  return test;
};
export const deleteArrayElement = (array, index) => {
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
};
export const findObj = (value, arrJson, key) => {
  if (!value || !key || !arrJson) return -1;
  for (let i = 0; i < arrJson.length; i++) {
    const element = arrJson[i][key];
    if (element === value) return i;
  }
  return -1;
};
