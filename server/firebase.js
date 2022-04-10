import firebase from "firebase";
import "firebase/storage";
var firebaseConfig = {
  apiKey: "AIzaSyDe9yym0sxHeGXEFmp946CYIt-_LwNzdiM",
  authDomain: "meta-doc.firebaseapp.com",
  projectId: "meta-doc",
  storageBucket: "meta-doc.appspot.com",
  messagingSenderId: "117618408677",
  appId: "1:117618408677:web:8886e4084c524b1f33e80c",
  databaseURL:
    "https://meta-doc-default-rtdb.asia-southeast1.firebasedatabase.app/",
};
// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
} catch (error) {}
export const db = firebase;

export var uid = "";
export var userName = "";
export var userImage = "";
try {
  uid = localStorage.getItem("uid");
  userName = localStorage.getItem("userName");
  userImage = localStorage.getItem("userImage");
} catch (error) {
  console.log(error);
}
var firepadRef = firebase.database().ref();
export var storageRef = firebase.storage().ref();
export const createRoom = (roomId) => {
  try {
    firepadRef = firepadRef.child(roomId);
    firepadRef
      .child("data")
      .child("settings")
      .set({ admin: uid, meetingTime: new Date().getTime() });
  } catch (error) {}
};
export const joinRoom = (roomId) => {
  firepadRef = firepadRef.child(roomId);
  storageRef = storageRef.child(`chat/${roomId}`);
};

export default firepadRef;
