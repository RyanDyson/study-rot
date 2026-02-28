import { SignIn } from "@/app/auth/components/sign-in";
import { SignUp } from "@/app/auth/components/sign-up";
import { ResetPassword } from "@/app/auth/components/reset-password";
import { OTP } from "@/app/auth/components/otp";

export enum Mode {
  LOGIN = "login",
  SIGNUP = "signup",
  RESET_PASSWORD = "reset-password",
  OTP = "otp",
}

export const ModeConfig: Record<Mode, React.ReactNode> = {
  [Mode.LOGIN]: <SignIn />,
  [Mode.SIGNUP]: <SignUp />,
  [Mode.RESET_PASSWORD]: <ResetPassword />,
  [Mode.OTP]: <OTP />,
};
