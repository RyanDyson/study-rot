"use client";

import { createContext, useContext } from "react";
import type { Mode } from "@/config/auth";

interface AuthContextType {
  setMode: (mode: Mode) => void;
  mode: Mode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function useAuthNavigation() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthNavigation must be used within AuthContext");
  }
  return context;
}
