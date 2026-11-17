import "server-only";
import * as client from "openid-client";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
}

let cachedConfig: Promise<client.Configuration> | undefined;

export function getOidcConfig(): Promise<client.Configuration> {
  cachedConfig ??= client
    .discovery(
      new URL(requireEnv("COGNITO_ISSUER")),
      requireEnv("COGNITO_CLIENT_ID"),
      requireEnv("COGNITO_CLIENT_SECRET"),
    )
    .catch((error: unknown) => {
      cachedConfig = undefined;
      throw error;
    });
  return cachedConfig;
}

export function getCallbackUrl(): string {
  return `${requireEnv("APP_URL")}/auth/callback`;
}
