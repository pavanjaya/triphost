export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/trip/:path*", "/create/:path*"],
};
