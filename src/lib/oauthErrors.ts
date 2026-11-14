/** Never echo provider-supplied error text or tokens into the page. */
export function oauthErrorMessage(error: string | null): string | null {
  if (!error) return null;
  if (error === "OAuthAccountNotLinked") return "This identity is not linked to your profile. Sign in with your existing method, then connect Google or Microsoft in account settings.";
  if (error === "AccessDenied") return "Sign-in was not allowed. Use an AITU Microsoft account or a Google account with a verified email. Contact the site owner if this looks wrong.";
  if (error === "Configuration") return "Sign-in is temporarily unavailable because the provider needs configuration.";
  return "Sign-in could not be completed. Try again or use another sign-in method.";
}
