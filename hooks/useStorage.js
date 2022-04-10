import { useState, useEffect } from "react";
import firepadRef, { storageRef, userName } from "../server/firebase";
import { fileTypeName, generateUniqueId } from "../util/helper";

const UseStorage = (fileRef, docId) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);
  useEffect(() => {
    //references
    let file = fileRef.file;
    var name = "" + file.fileName;
    var d = new Date();
    var final_name =
      name.substring(0, name.lastIndexOf(".")) +
      "-" +
      d.getTime() +
      name.substring(name.lastIndexOf("."));
    console.log(final_name);
    const storage = storageRef
      .child("call-files")
      .child(docId)
      .child(final_name);

    storage.put(file).on(
      "state_changed",
      (snap) => {
        let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
        setProgress(percentage);
      },
      (error) => {
        setError(error);
      },
      async () => {
        const url = await storage.getDownloadURL();
        const createdAt = new Date().getTime();
        delete fileRef.file;
        // fileRef.fileName = name;
        firepadRef
          .child(docId)
          .child("data")
          .child("files")
          .child(generateUniqueId())
          .set({
            ...fileRef,
            timestamp: createdAt,
            fileUrl: url,
            username: userName,
            fileType: fileTypeName(
              file.type.substring(file.type.lastIndexOf("/") + 1)
            ),
          });
        setUrl(url);
      }
    );
  }, [fileRef, docId]);
  return { progress, url, error };
};
const UseStorageDeletion = (docId, id, url) => {
  storageRef
    .refFromURL(url)
    .delete()
    .then(() => {
      // File deleted successfully

      firepadRef
        .child(docId)
        .child("data")
        .child("files")
        .child(id)
        .remove()
        .then(() => {})
        .catch((error) => {});
    })
    .catch((error) => {});
};
export { UseStorage, UseStorageDeletion };
