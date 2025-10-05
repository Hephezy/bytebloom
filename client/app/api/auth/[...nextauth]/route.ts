// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
                mutation Login($email: String!, $password: String!) {
                  login(email: $email, password: $password) {
                    token
                    user {
                      id
                      email
                      name
                    }
                  }
                }
              `,
              variables: {
                email: credentials.email,
                password: credentials.password,
              },
            }),
          });

          if (!res.ok) return null;

          const { data, errors } = await res.json();

          if (errors || !data?.login) return null;

          const { user, token } = data.login;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            accessToken: token,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const { GET, POST } = handlers;
