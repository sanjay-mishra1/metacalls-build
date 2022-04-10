import React from "react";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/client";
import Login from "../../../components/Login";
import dynamic from "next/dynamic";

var CallInitiator = dynamic(
  () => import("../../../components/CallInitiator/CallInitiator"),
  {
    ssr: false,
  }
);
export default function Index() {
  const router = useRouter();
  const [session] = useSession();
  if (!session) return <Login />;

  const { roomId } = router.query;
  return <CallInitiator roomId={roomId} session={session} router={router} />;
}
export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { req, res } = context;
  if (!session) {
    res.writeHead(302, {
      Location: "/signin",
    });
    res.end();
    return {
      props: {
        ok: false,
        reason: "User not logged in. Redirecting to the login page",
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}
