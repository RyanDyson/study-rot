"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
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
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/server/better-auth/client";
import {
  Settings,
  LogOut,
  ChevronsUpDown,
  Zap,
  Home,
  LayoutDashboard,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export const AppSidebar = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const userName = session?.user?.name ?? "User";
  const userEmail = session?.user?.email ?? "";
  const userImage = session?.user?.image ?? "";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <Sidebar className="border-r border-sidebar-border">
      {/* Header */}
      <SidebarHeader className="px-4 py-4">{/* logo here */}</SidebarHeader>

      {/* Nav */}
      <SidebarContent className="px-3 py-2">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navItems.map(({ label, href, icon: Icon }) => {
                const isActive =
                  href === "/"
                    ? pathname === "/"
                    : href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(href);

                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={href}
                        className={cn(
                          "group/item relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                            isActive
                              ? "bg-primary/15 text-primary"
                              : "text-muted-foreground group-hover/item:text-sidebar-accent-foreground",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        {label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — user */}
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
              <Avatar className="h-8 w-8 shrink-0 ring-2 ring-primary/20">
                <AvatarImage src={userImage} />
                <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs font-semibold text-sidebar-foreground">
                  {userName}
                </span>
                <span className="truncate text-[11px] text-muted-foreground">
                  {userEmail}
                </span>
              </div>
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56"
            side="top"
            sideOffset={8}
          >
            <DropdownMenuLabel className="flex items-center gap-2.5 py-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={userImage} />
                <AvatarFallback className="bg-primary text-[10px] font-semibold text-primary-foreground">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-xs font-semibold">
                  {userName}
                </span>
                <span className="truncate text-[10px] font-normal text-muted-foreground">
                  {userEmail}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onClick={() => router.push("/settings")}
            >
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer gap-2 text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
