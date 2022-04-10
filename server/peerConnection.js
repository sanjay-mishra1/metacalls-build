import firepadRef, { db, uid, userName } from "./firebase";
import { store } from "../pages/_app";
import { formatUserId, generateUniqueId } from "../util/helper";
import { ALLOW_ANYONE } from "../util/constants";
var participantRef;
try {
  participantRef = firepadRef.child("participants");
} catch (error) {}
export const initRef = (roomId) => {
  try {
    participantRef = firepadRef.child(roomId).child("participants");
  } catch (error) {}
};
export const updatePreference = (userId, preference) => {
  const currentParticipantRef = participantRef
    .child(userId)
    .child("preferences");
  setTimeout(() => {
    currentParticipantRef.update(preference);
  });
};

export const createOffer = async (peerConnection, receiverId, createdID) => {
  const currentParticipantRef = participantRef.child(receiverId);
  peerConnection.onicecandidate = (event) => {
    event.candidate &&
      currentParticipantRef
        .child("offerCandidates")
        .push({ ...event.candidate.toJSON(), userId: createdID });
  };

  const offerDescription = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
    userId: createdID,
  };

  await currentParticipantRef.child("offers").push().set({ offer });
};

export const initializeListensers = async (userId) => {
  try {
    const currentUserRef = participantRef.child(userId);

    currentUserRef.child("offers").on("child_added", async (snapshot) => {
      const data = snapshot.val();
      if (data?.offer) {
        const pc =
          store.getState().participants[data.offer.userId].peerConnection;
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        await createAnswer(data.offer.userId, userId);
      }
    });

    currentUserRef.child("offerCandidates").on("child_added", (snapshot) => {
      const data = snapshot.val();
      if (data.userId) {
        const pc = store.getState().participants[data.userId].peerConnection;
        pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });

    currentUserRef.child("answers").on("child_added", (snapshot) => {
      const data = snapshot.val();
      if (data?.answer) {
        const pc =
          store.getState().participants[data.answer.userId].peerConnection;
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });

    currentUserRef.child("answerCandidates").on("child_added", (snapshot) => {
      const data = snapshot.val();
      if (data.userId) {
        const pc = store.getState().participants[data.userId].peerConnection;
        pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  } catch (error) {}
};

const createAnswer = async (otherUserId, userId) => {
  const pc = store.getState().participants[otherUserId].peerConnection;
  const participantRef1 = participantRef.child(otherUserId);
  pc.onicecandidate = (event) => {
    event.candidate &&
      participantRef1
        .child("answerCandidates")
        .push({ ...event.candidate.toJSON(), userId: userId });
  };

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
    userId: userId,
  };

  await participantRef1.child("answers").push().set({ answer });
};

export const checkMeetingLink = (roomId, setStatus) => {
  try {
    console.log("Room id=", roomId);
    let ref = db.database().ref();

    ref
      .orderByKey()
      .equalTo(roomId)
      .once("value", (snapshot) => {
        console.log("num", snapshot.numChildren());
        //meeting link found
        if (snapshot.numChildren() === 0) {
          console.log("num of childeren", snapshot.numChildren());
          setStatus(404);
          return;
        }
        //check whether user is already in the session
        ref
          .child(roomId)
          .child("participants")
          .orderByChild("uid")
          .equalTo(uid)
          .once("value", (child) => {
            console.log("num", snapshot.numChildren());
            console.log("child", child.val());

            if (child.val() === null) {
              //check if user is admin
              console.log("snapshot", snapshot.val(), snapshot.val()["data"]);
              if (snapshot.val()[roomId].data.settings.admin === uid) {
                setStatus(200);
                return;
              }
              //check if user require permission to join the call
              ref
                .child(roomId)
                .child("data")
                .child("settings")
                .once("value", (snapSettings) => {
                  if (snapSettings.val()[ALLOW_ANYONE]) {
                    setStatus(501);
                    let reference = ref
                      .child(roomId)
                      .child("data")
                      .child("participants-status");
                    reference
                      .child(formatUserId(uid))
                      .set({ uid: uid, status: "waiting", name: userName });
                    //listen to the change to the permission of the user access
                    reference
                      .orderByChild("uid")
                      .equalTo(uid)
                      .on("value", (userSnap) => {
                        console.log(userSnap.val());
                        let snap = userSnap.val();
                        if (snap && snap[Object.keys(snap)[0]].status) {
                          switch (snap[Object.keys(snap)[0]].status) {
                            case "waiting":
                              setStatus(501);
                              break;
                            case "denied":
                              setStatus(500);
                              break;
                            case "allowed":
                              setStatus(200);
                              break;
                            default:
                              break;
                          }
                        }
                      });
                  } else setStatus(200);
                });
            } else setStatus(Object.keys(child.val())[0]);
          });
      });
  } catch (error) {
    setStatus(null);
  }
};

export const removeActiveSession = (roomId, participantId) => {
  console.log("Room id=", roomId);
  let ref = db.database().ref();
  ref.child(roomId).child("participants").child(participantId).remove();
};
export const storeSettings = (roomId, value) => {
  console.log("Room id=", roomId);
  let ref = db.database().ref();
  ref.child(roomId).child("data/settings").update(value);
};

export const removeCall = (roomId) => {
  let ref = db.database().ref();
  ref.child(roomId).remove();
};
export const storeEmoji = (emoji, roomId) => {
  let ref = db.database().ref();
  ref
    .child(roomId)
    .child("data")
    .child("emoji")
    .child(generateUniqueId())
    .set({ emoji, username: userName });
};
export const requestJoiningCall = (roomId) => {
  let ref = db.database().ref();
  let reference = ref.child(roomId).child("data").child("participants-status");
  reference.child(formatUserId(uid)).update({ userId: uid, status: "waiting" });
};

export const acceptCallJoinRequest = (roomId, uid, status) => {
  let ref = db.database().ref();
  let reference = ref.child(roomId).child("data").child("participants-status");
  reference.child(formatUserId(uid)).update({ userId: uid, status });
};

export const disableAllMedia = (key, roomId, adminId) => {
  let ref = db.database().ref().child(roomId).child("participants");
  ref.once("value", (snapshot) => {
    Object.keys(snapshot.val()).forEach((item) => {
      console.log("adminId", adminId, "userid", snapshot.val()[item].uid);
      if (adminId !== snapshot.val()[item].uid)
        ref
          .child(item)
          .child("preferences")
          .update({ [key]: false });
    });
  });
};
