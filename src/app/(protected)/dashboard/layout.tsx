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
      </SidebarInset>
      <main>{children}</main>
    </SidebarProvider>
  );
}
