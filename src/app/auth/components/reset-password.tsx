"use client";

import { useState, useEffect } from "react";
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

interface ResetPasswordProps {
  token?: string;
  email?: string;
}

export function ResetPassword({ token, email }: ResetPasswordProps) {
  const { setMode } = useAuthNavigation();
  const [step, setStep] = useState<"request" | "reset">(
    token ? "reset" : "request",
  );
  const [requestEmail, setRequestEmail] = useState(email || "");
  const [resetToken, setResetToken] = useState(token || "");

  // Check URL for token parameter
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get("token");
      const urlEmail = params.get("email");
      if (urlToken) {
        setStep("reset");
        setResetToken(urlToken);
        setRequestEmail(urlEmail || "");
      }
    }
  }, []);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!requestEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      // Better Auth password reset request
      // Note: Better Auth may use a different method name or structure
      // You may need to use: authClient.forgetPassword() or authClient.sendPasswordResetEmail()
      // or implement a custom API route for password reset requests
      // This is a placeholder - adjust based on your Better Auth configuration

      // Option 1: If Better Auth has forgetPassword method (uncomment if available)
      // const data = await authClient.forgetPassword({
      //   email: requestEmail,
      //   redirectTo: `${window.location.origin}/auth/reset-password`,
      // });

      // Option 2: Use a custom API route
      const response = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: requestEmail }),
      });

      const data = await response.json();

      if (data.error || !response.ok) {
        toast.error(data.error?.message || "Failed to send reset email");
      } else {
        toast.success("Password reset email sent! Check your inbox.");
        setStep("reset");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      // Better Auth password reset - uses newPassword instead of password
      const data = await authClient.resetPassword({
        newPassword: password,
        token: resetToken || token || "",
      });

      if (data.error) {
        toast.error(data.error.message || "Failed to reset password");
      } else {
        toast.success("Password reset successfully!");
        // Navigate to sign in
        setTimeout(() => {
          setMode(Mode.LOGIN);
        }, 1500);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "request") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className={cn("text-3xl", dmSans.className)}>
            Reset Password
          </CardTitle>
          <CardDescription className="text-base">
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={requestEmail}
                onChange={(e) => setRequestEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className={cn("text-3xl", dmSans.className)}>
          Set New Password
        </CardTitle>
        <CardDescription className="text-base">
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={8}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
