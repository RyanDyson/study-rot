"use client";

import { useState } from "react";
import { Mode, ModeConfig } from "@/config/auth";
import { AuthContext } from "./components/auth-context";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>(Mode.LOGIN);

  return (
    <AuthContext.Provider value={{ mode, setMode }}>
      <div className="min-w-screen h-screen flex items-center justify-center">
        <div className="hidden lg:flex items-center w-1/2 h-full  bg-linear-to-br from-primary to-secondary">
          <div className="-translate-x-32 p-1 bg-neutral-300/90 border-2 backdrop-blur-xl rounded-xl border-neutral-400 flex flex-col items-center justify-center">
            <div className="w-full gap-x-1 pb-2 pt-1 px-4 items-center justify-end flex">
              <div className="bg-emerald-200 border border-emerald-500 rounded-full h-3 w-3" />
              <div className="bg-amber-200 border border-amber-500 rounded-full h-3 w-3" />
              <div className="bg-red-200 border border-red-500 rounded-full h-3 w-3" />
            </div>
            <div className="w-[800px] h-[500px] bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
              {/* <Image
                src="/preview.png"
                alt="App Preview"
                className="w-full h-full object-cover"
              /> */}
            </div>
          </div>
        </div>
        <div className="relative z-50 md:w-1/2 flex flex-col items-center justify-center gap-6 p-4">
          {ModeConfig[mode]}
          {mode === Mode.LOGIN && (
            <p className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setMode(Mode.SIGNUP)}
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          )}
          {mode === Mode.SIGNUP && (
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => setMode(Mode.LOGIN)}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          )}
          {(mode === Mode.RESET_PASSWORD || mode === Mode.OTP) && (
            <p className="text-sm text-center text-muted-foreground">
              Remember your password?{" "}
              <button
                onClick={() => setMode(Mode.LOGIN)}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </AuthContext.Provider>
  );
}
