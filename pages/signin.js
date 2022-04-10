import React from "react";
import { providers, signIn, getSession, csrfToken } from "next-auth/client";
import {
  Box,
  Button,
  CardHeader,
  Input,
  Card,
  Grid,
  Divider,
} from "@material-ui/core";
export default function SignIn({ providers, csrfToken }) {
  return (
    <div style={{ textAlign: "-webkit-center" }}>
      <Card style={{ width: "fit-content", padding: "100px" }}>
        <h1 style={{ textAlign: "center" }}>Login</h1>
        <Divider />
        <Box alignContent="center" justifyContent="center" marginTop={12}>
          <Grid container isInline marginTop={12}>
            {Object.values(providers).map((provider) => {
              if (provider.name === "Email") {
                return;
              }
              return (
                <Box key={provider.name}>
                  <Button
                    variant="contained"
                    endIcon={
                      <img width={67} src="/google_logo.svg" alt="google" />
                    }
                    onClick={() => signIn(provider.id)}
                  >
                    Sign in with
                  </Button>
                </Box>
              );
            })}
          </Grid>
        </Box>
      </Card>
    </div>
  );
}

SignIn.getInitialProps = async (context) => {
  const { req, res } = context;
  const session = await getSession({ req });

  if (session && res && session.accessToken) {
    res.writeHead(302, {
      Location: "/",
    });
    res.end();
    return;
  }

  return {
    session: undefined,
    providers: await providers(context),
    csrfToken: await csrfToken(context),
  };
};
