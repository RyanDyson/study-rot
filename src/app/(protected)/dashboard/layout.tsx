import { type Metadata } from "next";
import { AppNavbar } from "@/components/global/sidebar";
import { NavbarProvider } from "@/components/global/navbar-context";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your courses and generate AI-powered study threads.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavbarProvider>
      <div className="flex h-screen flex-col">
        <AppNavbar />
        <main className="flex flex-1 flex-col overflow-y-auto">{children}</main>
      </div>
    </NavbarProvider>
  );
}
