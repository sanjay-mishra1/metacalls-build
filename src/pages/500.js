import React from "react";

export default function Error500() {
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
  return <div></div>;
}
//export async function getServerSideProps(context) {
//   const { req, res } = context;

//   res.writeHead(302, {
//     Location: "/",
//   });
//   res.end();
//   //return;
//   return {
//     props: {
//       ok: false,
//       reason: "User not logged in. Redirecting to the login page",
//     },
//   };
// }
