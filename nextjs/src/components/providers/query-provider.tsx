"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  // Use useState to ensure the QueryClient is only instantiated once per session 
  // on the client, avoiding data loss on React component re-renders.
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};