export const LOGIN_COOKIE = "books_login";

export type LoginAttempt = {
  state: string;
  codeVerifier: string;
};

export function parseLoginAttempt(
  value: string | undefined,
): LoginAttempt | null {
  if (!value) {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return null;
  }

  if (
    typeof parsed === "object" &&
    parsed !== null &&
    "state" in parsed &&
    "codeVerifier" in parsed &&
    typeof parsed.state === "string" &&
    typeof parsed.codeVerifier === "string" &&
    parsed.state !== "" &&
    parsed.codeVerifier !== ""
  ) {
    return { state: parsed.state, codeVerifier: parsed.codeVerifier };
  }

  return null;
}
