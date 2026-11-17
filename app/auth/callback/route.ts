import { connection, NextResponse, type NextRequest } from "next/server";
import * as client from "openid-client";
import { logger } from "@/app/lib/logger";
import { LOGIN_COOKIE, parseLoginAttempt } from "@/app/lib/login-attempt";
import { getCallbackUrl, getOidcConfig } from "@/app/lib/oidc";

function withoutLoginCookie(response: NextResponse): NextResponse {
  response.cookies.set(LOGIN_COOKIE, "", { path: "/auth", maxAge: 0 });
  return response;
}

function signInFailed(): NextResponse {
  return withoutLoginCookie(
    new NextResponse("Sign-in failed. Please try again.", { status: 400 }),
  );
}

export async function GET(request: NextRequest) {
  await connection();

  const attempt = parseLoginAttempt(request.cookies.get(LOGIN_COOKIE)?.value);
  if (!attempt) {
    return signInFailed();
  }

  try {
    const currentUrl = new URL(getCallbackUrl());
    currentUrl.search = request.nextUrl.search;

    const config = await getOidcConfig();
    const tokens = await client.authorizationCodeGrant(config, currentUrl, {
      pkceCodeVerifier: attempt.codeVerifier,
      expectedState: attempt.state,
    });

    const claims = tokens.claims();
    if (!claims || typeof claims.email !== "string") {
      return signInFailed();
    }

    return withoutLoginCookie(new NextResponse(`Signed in as ${claims.email}`));
  } catch (error) {
    logger.error("auth.callback.failed", { error });
    return signInFailed();
  }
}
