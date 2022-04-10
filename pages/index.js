import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { getSession, useSession } from "next-auth/client";
import Login from "../components/Login";
import HomePage from "../components/HomePage/HomePage";
export default function Home() {
  return (
    <>
      <HomePage />
    </>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
