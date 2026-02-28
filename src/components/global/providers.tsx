"use client";

import { HydrateClient } from "@/trpc/server";
import { TRPCReactProvider } from "@/trpc/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </QueryClientProvider>
  );
}
