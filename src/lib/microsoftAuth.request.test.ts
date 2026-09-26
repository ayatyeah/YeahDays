import { afterEach, expect, it, vi } from "vitest";
import { Auth, type AuthConfig } from "@auth/core";
import { AITU_ENTRA_CLIENT_ID, AITU_ENTRA_ISSUER, AITU_ENTRA_TENANT_ID, microsoftProvider } from "./microsoftAuth";

afterEach(() => vi.unstubAllGlobals());
it("starts a real Auth.js OIDC request with the registered callback, state, nonce and PKCE", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({
    issuer: AITU_ENTRA_ISSUER,
    authorization_endpoint: `https://login.microsoftonline.com/${AITU_ENTRA_TENANT_ID}/oauth2/v2.0/authorize`,
    token_endpoint: `https://login.microsoftonline.com/${AITU_ENTRA_TENANT_ID}/oauth2/v2.0/token`,
    jwks_uri: `https://login.microsoftonline.com/${AITU_ENTRA_TENANT_ID}/discovery/v2.0/keys`,
    response_types_supported: ["code"], subject_types_supported: ["pairwise"],
    id_token_signing_alg_values_supported: ["RS256"], code_challenge_methods_supported: ["S256"],
  })));
  const config: AuthConfig = { trustHost: true, secret: "test-auth-secret-for-this-test-only", basePath: "/api/auth", providers: [microsoftProvider("test-client-secret")!] };
  const csrf = await Auth(new Request("https://yeahgrind.test/api/auth/csrf"), config);
  const { csrfToken } = await csrf.json();
  const cookie = csrf.headers.getSetCookie().map((v) => v.split(";", 1)[0]).join("; ");
  const response = await Auth(new Request("https://yeahgrind.test/api/auth/signin/microsoft-entra-id", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", cookie },
    body: new URLSearchParams({ csrfToken, callbackUrl: "https://yeahgrind.test/settings" }),
  }), config);
  expect(response.status).toBe(302);
  const destination = new URL(response.headers.get("location")!);
  expect(destination.origin).toBe("https://login.microsoftonline.com");
  expect(destination.pathname).toBe(`/${AITU_ENTRA_TENANT_ID}/oauth2/v2.0/authorize`);
  expect(destination.searchParams.get("client_id")).toBe(AITU_ENTRA_CLIENT_ID);
  expect(destination.searchParams.get("response_type")).toBe("code");
  expect(destination.searchParams.get("redirect_uri")).toBe("https://yeahgrind.test/api/auth/callback/microsoft-entra-id");
  expect(destination.searchParams.get("scope")).toBe("openid profile email");
  expect(destination.searchParams.get("code_challenge_method")).toBe("S256");
  for (const key of ["state", "nonce", "code_challenge"]) expect(destination.searchParams.get(key)?.length).toBeGreaterThan(20);
  expect(destination.toString()).not.toContain("test-client-secret");
});
