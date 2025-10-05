// client/app/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { ApolloProvider } from "@apollo/client/react";
import createApolloClient from "@/lib/apolloClient"; // We will create this next

export function Providers({ children }: { children: React.ReactNode }) {
  const client = createApolloClient();

  return (
    <SessionProvider>
      <ApolloProvider client={client}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </ApolloProvider>
    </SessionProvider>
  );
};