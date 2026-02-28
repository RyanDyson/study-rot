"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { dmSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { authClient } from "@/server/better-auth/client";
import { toast } from "sonner";
import { useAuthNavigation } from "./auth-context";
import { Mode } from "@/config/auth";

export function SignIn() {
  const { setMode } = useAuthNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const googleSignIn = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    });

    if (data.error) {
      console.error(data.error);
      toast.error(data.error.message);
    }
  };

  const emailSignIn = async () => {
    const data = await authClient.signIn.email({
      email,
      password,
    });

    if (data.error) {
      console.error(data.error);
      toast.error(data.error.message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    emailSignIn();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className={cn("text-3xl", dmSans.className)}>
          Welcome Back
        </CardTitle>
        <CardDescription className="text-base">
          Sign in to
          {/* <span className={cn("font-semibold", dmSans.className)}>
            put app name
          </span> */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                onClick={() => setMode(Mode.RESET_PASSWORD)}
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 pt-1">
        <span className="px-2 flex justify-center text-center text-sm text-muted-foreground">
          Or continue with
        </span>

        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={googleSignIn}
        >
          Google
        </Button>
      </CardFooter>
    </Card>
  );
}
