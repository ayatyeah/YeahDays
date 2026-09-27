import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import type { MicrosoftEntraIDProfile } from "next-auth/providers/microsoft-entra-id";

// Public IDs of the YeahGrind app registered by the owner in AITU's directory.
export const AITU_ENTRA_CLIENT_ID = "552b08ec-6293-4081-9a66-5f0467a243ca";
export const AITU_ENTRA_TENANT_ID = "158f15f3-83e0-4906-824c-69bdc50d9d61";
export const MICROSOFT_PROVIDER = "microsoft-entra-id";
export const AITU_ENTRA_ISSUER = `https://login.microsoftonline.com/${AITU_ENTRA_TENANT_ID}/v2.0`;

/** Invoked only after Auth.js has verified the token signature, issuer, audience and nonce. */
export function microsoftProfile(profile: Partial<MicrosoftEntraIDProfile>) {
  if (profile.tid !== AITU_ENTRA_TENANT_ID || !profile.sub || typeof profile.sub !== "string") {
    throw new Error("Microsoft account is not from the configured AITU directory");
  }
  return {
    id: profile.sub,
    name: profile.name || profile.preferred_username || "Студент AITU",
    // Email is mutable in Entra and must not merge this identity with password/Google users.
    // Existing users explicitly link Microsoft from their authenticated profile instead.
    email: null,
    image: null,
  };
}

/** Only diagnostic codes; never log tokens, codes, secrets or provider descriptions. */
export async function logMicrosoftTokenError(response: Response) {
  try {
    const body = await response.clone().json();
    if (typeof body?.error === "string") {
      const codes: number[] = Array.isArray(body.error_codes)
        ? body.error_codes.filter((code: unknown) => typeof code === "number" && Number.isSafeInteger(code) && code > 0).slice(0, 10)
        : [];
      console.error("[auth][microsoft]", JSON.stringify({ status: response.status, aadsts: codes }));
    }
  } catch { /* Diagnostics must never change the authentication response. */ }
  return undefined;
}

export function microsoftProvider(secret = process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET) {
  if (!secret?.trim()) return null;
  return MicrosoftEntraID({
    clientId: AITU_ENTRA_CLIENT_ID,
    clientSecret: secret.trim(),
    issuer: AITU_ENTRA_ISSUER,
    name: "Microsoft AITU",
    authorization: { params: { scope: "openid profile email", prompt: "select_account" } },
    checks: ["pkce", "state", "nonce"],
    token: { conform: logMicrosoftTokenError },
    profile: microsoftProfile,
    // No Graph API or background Microsoft access is needed for sign-in.
    account: () => ({}),
  });
}
