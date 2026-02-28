"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { authClient } from "@/server/better-auth/client";
import { toast } from "sonner";
import { useAuthNavigation } from "./auth-context";
import { Mode } from "@/config/auth";
import { Github } from "lucide-react";

export function SignIn() {
  const { setMode, setEmail: setContextEmail } = useAuthNavigation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubSignIn = async () => {
    const data = await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });

    if (data.error) {
      console.error(data.error);
      toast.error(data.error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await authClient.signIn.email({ email, password });

      if (data.error) {
        console.error(data.error);
        toast.error(data.error.message);
        return;
      }

      if (data.data && "twoFactorRedirect" in data.data) {
        await authClient.twoFactor.sendOtp();
        toast.success("Check your email for a verification code.");
        setContextEmail(email);
        setMode(Mode.OTP);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="font-serif text-3xl font-normal tracking-tight text-white">
          Login
        </CardTitle>
        <CardDescription className="border-b pb-4 text-sm">
          Welcome back to StudyRot
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-normal">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="user@nextmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-11 rounded-sm"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-normal">
                Password
              </Label>
              <button
                type="button"
                onClick={() => setMode(Mode.RESET_PASSWORD)}
                className="text-sm transition-color hover:underline"
              >
                Reset Password
              </button>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="h-11 rounded-sm "
            />
          </div>
          <Button
            type="submit"
            className="h-11 w-full rounded-sm border font-medium text-white transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t border-zinc-700/80 pt-6">
        <Button
          variant="outline"
          type="button"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-sm border-zinc-600 bg-zinc-900 text-white transition-colors hover:border-zinc-500 hover:bg-zinc-800"
          onClick={handleGitHubSignIn}
        >
          <Github className="size-5" />
          Sign in with GitHub
        </Button>
      </CardFooter>
    </Card>
  );
}
