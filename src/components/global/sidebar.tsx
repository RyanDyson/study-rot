"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navigation } from "@/config/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/server/better-auth/client";
import { Settings, LogOut, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";

export const AppSidebar = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };
  return (
    <Sidebar>
      <SidebarHeader>
        <span>your app name</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigation.map((nav) => (
            <SidebarMenuButton key={nav.href}>
              <Link href={nav.href}>{nav.label}</Link>
            </SidebarMenuButton>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent transition-colors cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user?.image ?? ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {session?.user?.name?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col items-start text-left">
                  <span className="text-xs  font-semibold">
                    {session?.user?.name ?? "User"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {session?.user?.email ?? "user@example.com"}
                  </span>
                </div>
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" side="top">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
};
