export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/((?!login|api/auth|api/place|_next/static|_next/image|favicon.ico|manifest.json|icons|howztrip.svg).*)",
  ],
};
