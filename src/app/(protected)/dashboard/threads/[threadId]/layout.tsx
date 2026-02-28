import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Thread",
  description: "Read your AI-generated brainrot study thread.",
};

export default function ThreadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
