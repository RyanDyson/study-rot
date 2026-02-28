import { AppNavbar } from "@/components/global/sidebar";
import { AppHeader } from "@/components/global/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <AppNavbar />
      {/* <AppHeader /> */}
      <main className="flex flex-1 h-full flex-col">{children}</main>
    </div>
  );
}
