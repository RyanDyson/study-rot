"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/server/better-auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavbarCenterState } from "@/components/global/navbar-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  LogOut,
  Zap,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export const AppNavbar = () => {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const navbarCenter = useNavbarCenterState();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const userName = session?.user?.name ?? "User";
  const userEmail = session?.user?.email ?? "";
  const userImage = session?.user?.image ?? "";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="relative flex h-14 items-center gap-6 px-4 lg:px-6">
        {/* Brand */}
        {/* <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary transition-transform group-hover:scale-105">
            <Zap className="h-3.5 w-3.5 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="text-sm font-semibold text-foreground">StudyRot</span>
        </Link> */}

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === "/dashboard" ||
                  pathname.startsWith("/dashboard/")
                : pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Center slot — injected by pages via context */}
        {navbarCenter && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center text-center">
              <span className="text-sm font-semibold leading-tight text-foreground">
                {navbarCenter.title}
              </span>
              {navbarCenter.description && (
                <span className="max-w-xs truncate text-[11px] text-muted-foreground">
                  {navbarCenter.description}
                </span>
              )}
            </div>
          </div>
        )}

        {/* User menu — pushed to the right */}
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" asChild>
              <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-7 w-7 ring-2 ring-primary/20">
                  <AvatarImage src={userImage} />
                  <AvatarFallback className="bg-primary text-[10px] font-semibold text-primary-foreground">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col text-left sm:flex">
                  <span className="text-xs font-semibold leading-none text-foreground">
                    {userName}
                  </span>
                  <span className="mt-0.5 max-w-[140px] truncate text-[10px] text-muted-foreground">
                    {userEmail}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
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
        </div>
      </div>
    </header>
  );
};

// Keep the old name as an alias so any other imports don't break
export { AppNavbar as AppSidebar };
