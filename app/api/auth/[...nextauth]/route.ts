import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Dev-only: quick guest login without Google OAuth setup
    ...(process.env.NODE_ENV === "development"
      ? [
          CredentialsProvider({
            id: "dev-guest",
            name: "Dev Guest",
            credentials: {},
            async authorize() {
              return {
                id: "dev-user-1",
                name: "Pavan J",
                email: "jangidpavan@gmail.com",
                image: null,
              };
            },
          }),
        ]
      : []),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
