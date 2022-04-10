import React from "react";
import CallInitialPage from "../components/CallInitialPage/CallInitialPage";
import { getSession, useSession, signOut, signIn } from "next-auth/client";
import Login from "../components/Login";
import { setUserGlobalInfo } from "../util/helper";

export default function Meet() {
  const [session] = useSession();
  // if (!session) {
  //   Router.ps
  //   router.push("signin");
  //   return;
  // } //return <Login />;
  setUserGlobalInfo(session.user);
  return <CallInitialPage user={session.user} logout={signOut} />;
}
export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { req, res } = context;
  if (!session) {
    res.writeHead(302, {
      Location: "/signin",
    });
    res.end();
    return;
  }
  return {
    props: {
      session,
    },
  };
}
