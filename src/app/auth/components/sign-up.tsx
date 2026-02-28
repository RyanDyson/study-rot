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
// import { useAuthNavigation } from "../auth-context";
// import { Mode } from "../config";

export function SignUp() {
  // const { setMode } = useAuthNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      const data = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (data.error) {
        toast.error(data.error.message || "Failed to create account");
      } else {
        toast.success("Account created! Please verify your email.");
        // Navigate to OTP verification if email verification is required
        // setMode(Mode.OTP);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className={cn("text-3xl italic", dmSans.className)}>
          Create an account
        </CardTitle>
        <CardDescription className="text-base">
          Join{" "}
          <span className={cn("font-semibold", dmSans.className)}>
            re:Automate
          </span>{" "}
          today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Sign Up
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 pt-1">
        <span className="px-2 text-sm text-muted-foreground">
          Or continue with
        </span>

        <Button variant="outline" type="button" className="w-full">
          Google
        </Button>
      </CardFooter>
    </Card>
  );
}
