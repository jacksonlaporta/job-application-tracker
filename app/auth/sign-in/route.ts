import { connection, NextResponse } from "next/server";
import * as client from "openid-client";
import { getCallbackUrl, getOidcConfig } from "@/app/lib/oidc";
import { LOGIN_COOKIE } from "@/app/lib/login-attempt";

export async function GET() {
  await connection();

  const config = await getOidcConfig();
  const state = client.randomState();
  const codeVerifier = client.randomPKCECodeVerifier();
  const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
  const authorizationUrl = client.buildAuthorizationUrl(config, {
    redirect_uri: getCallbackUrl(),
    scope: "openid email",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });
  const response = NextResponse.redirect(authorizationUrl);

  response.cookies.set(LOGIN_COOKIE, JSON.stringify({ state, codeVerifier }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/auth",
    maxAge: 60 * 10,
  });

  return response;
}
