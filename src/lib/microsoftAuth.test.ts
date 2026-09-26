import { describe, expect, it, vi, afterEach } from "vitest";
import { AITU_ENTRA_CLIENT_ID, AITU_ENTRA_TENANT_ID, AITU_ENTRA_ISSUER, microsoftProvider, microsoftProfile } from "./microsoftAuth";

afterEach(() => vi.unstubAllEnvs());
describe("AITU Microsoft identity", () => {
  it("does not expose a nonfunctional provider before the secret is configured", () => {
    vi.stubEnv("AUTH_MICROSOFT_ENTRA_ID_SECRET", "");
    expect(microsoftProvider()).toBeNull();
    expect(microsoftProvider("  ")).toBeNull();
  });
  it("uses the registered app, specific AITU directory, and protected authorization-code flow", () => {
    const provider = microsoftProvider("server-only-secret")!;
    expect(provider.options).toMatchObject({
      clientId: AITU_ENTRA_CLIENT_ID, clientSecret: "server-only-secret", issuer: AITU_ENTRA_ISSUER,
      checks: ["pkce", "state", "nonce"],
      authorization: { params: { scope: "openid profile email", prompt: "select_account" } },
    });
    expect(provider.id).toBe("microsoft-entra-id");
  });
  it("binds identity to the verified Microsoft subject rather than mutable email", () => {
    const a = microsoftProfile({ tid: AITU_ENTRA_TENANT_ID, sub: "student-1", email: "owner@example.com", name: "Alice" });
    const b = microsoftProfile({ tid: AITU_ENTRA_TENANT_ID, sub: "student-2", email: "owner@example.com", name: "Bob" });
    expect(a).toEqual({ id: "student-1", name: "Alice", email: null, image: null });
    expect(b.id).not.toBe(a.id);
    expect(b.email).toBeNull();
  });
  it("keeps the same identity when email/name changes", () => {
    const profile = { tid: AITU_ENTRA_TENANT_ID, sub: "student-1" };
    expect(microsoftProfile({ ...profile, name: "Old" }).id).toBe(microsoftProfile({ ...profile, name: "New" }).id);
  });
  it.each([
    { tid: "another-university", sub: "student-1" },
    { tid: AITU_ENTRA_TENANT_ID },
    { tid: AITU_ENTRA_TENANT_ID, sub: "" },
  ])("rejects missing subject or another tenant", (profile) => {
    expect(() => microsoftProfile(profile)).toThrow();
  });
  it("does not persist Microsoft access/refresh/ID tokens", async () => {
    const provider = microsoftProvider("server-only-secret")!;
    const account = await provider.options!.account!({ access_token: "private-access", refresh_token: "private-refresh", id_token: "private-id", token_type: "bearer" });
    expect(account).toEqual({});
  });
});
