import React from "react";
import Image from "next/image";
import { signIn } from "next-auth/client";
import { Button } from "@material-ui/core";

function Login() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Button onClick={signIn}>Login</Button>
    </div>
  );
}

export default Login;
