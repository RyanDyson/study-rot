import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "StudyRot",
    template: "%s | StudyRot",
  },
  description:
    "Doomscroll your way to an A. Turn any course syllabus into bingeable, brainrot Twitter threads powered by AI.",
  keywords: ["study", "AI", "learning", "Twitter threads", "education", "notes"],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "StudyRot",
    description: "Doomscroll your way to an A.",
    siteName: "StudyRot",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyRot",
    description: "Doomscroll your way to an A.",
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} dark`}>
      <body>
        <TRPCReactProvider>
          <Toaster />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
