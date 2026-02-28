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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { dmSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { authClient } from "@/server/better-auth/client";
import { toast } from "sonner";
import { useAuthNavigation } from "./auth-context";
import { Mode } from "@/config/auth";

interface OTPProps {
  email?: string;
  onSuccess?: () => void;
  onResend?: () => void;
}

export function OTP({ email, onSuccess, onResend }: OTPProps) {
  const { setMode } = useAuthNavigation();
  const [otpEmail, setOtpEmail] = useState(email || "");

  // Check URL for email parameter
  useEffect(() => {
    if (typeof window !== "undefined" && !email) {
      const params = new URLSearchParams(window.location.search);
      const urlEmail = params.get("email");
      if (urlEmail) {
        setOtpEmail(urlEmail);
      }
    }
  }, [email]);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);

    try {
      // Verify OTP - adjust this based on your Better Auth setup
      // This is a placeholder - you'll need to implement the actual verification
      // Better Auth email verification typically uses a token-based approach
      const data = await authClient.verifyEmail({
        query: {
          token: otp,
        },
      });

      if (data.error) {
        toast.error(data.error.message || "Invalid verification code");
      } else {
        toast.success("Email verified successfully!");
        onSuccess?.();
        // Navigate to sign in after successful verification
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

  const handleResend = async () => {
    if (!otpEmail) {
      toast.error("Email is required to resend code");
      return;
    }

    setIsResending(true);

    try {
      // Resend OTP - adjust this based on your Better Auth setup
      // Better Auth typically uses sendVerificationEmail or similar method
      // This is a placeholder - implement based on your Better Auth configuration
      const data = await authClient.sendVerificationEmail({
        email: otpEmail,
      });

      if (data.error) {
        toast.error(data.error.message || "Failed to resend code");
      } else {
        toast.success("Verification code sent!");
        onResend?.();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      // If method doesn't exist, show helpful message
      if (errorMessage.includes("does not exist")) {
        toast.error("Please configure email verification in Better Auth");
      } else {
        toast.error("An error occurred. Please try again.");
      }
      console.error(error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className={cn("text-3xl", dmSans.className)}>
          Verify Your Email
        </CardTitle>
        <CardDescription className="text-base">
          Enter the 6-digit code sent to{" "}
          {otpEmail && (
            <span className="font-semibold text-foreground">{otpEmail}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-center w-full block">
              Verification Code
            </Label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 pt-1">
        <p className="text-sm text-center text-muted-foreground">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || !otpEmail}
            className="text-primary hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? "Resending..." : "Resend code"}
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
