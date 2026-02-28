import { AppSidebar } from "@/components/global/sidebar";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppHeader } from "@/components/global/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
