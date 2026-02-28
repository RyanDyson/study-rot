"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { dmSans } from "@/lib/fonts";
import { authClient } from "@/server/better-auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { navigation } from "@/config/navigation";

export const Navbar = () => {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed z-40 flex h-min w-screen justify-center p-4">
      <div className="flex w-full items-center justify-center space-x-6 rounded-lg border-2 border-zinc-800 bg-zinc-900/70 px-4 py-2 text-zinc-50 backdrop-blur-lg md:w-fit md:rounded-full">
        <div className="jusitfy-between hidden h-full space-x-2 md:flex md:space-x-4">
          {navigation.map((nav, index) => (
            <Link
              href={nav.href}
              key={index}
              className="flex items-center justify-center rounded-full p-2 leading-none transition-colors duration-100 hover:text-zinc-300 active:bg-zinc-50 active:text-zinc-950"
            >
              {nav.label}
            </Link>
          ))}
        </div>
        <Separator orientation="vertical" className="h-full" />
        {session ? (
          <Link
            href="/dashboard"
            className="flex items-center justify-center mx-0"
          >
            <Button className="cursor-pointer flex items-center gap-x-2 min-h-fit min-w-fit py-2  rounded-full">
              <Avatar>
                <AvatarImage src={session.user?.image ?? ""} />
                <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>Dashboard</span>
            </Button>
          </Link>
        ) : (
          <Link href="/auth" className="hidden md:flex">
            <Button
              variant="outline"
              className="w-full rounded-full border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700/50 hover:text-zinc-50"
            >
              Sign In
            </Button>
          </Link>
        )}
        <div className="ms-0 flex w-full flex-col md:hidden">
          <div className="flex w-full items-center justify-between">
            <span className={`${dmSans.className} italic`}>Your App Name</span>
            <div className="flex items-center gap-x-4">
              <button onClick={() => setIsOpen(!isOpen)}>
                <Menu className="text-zinc-50" size={24} />
              </button>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
            style={{ marginLeft: 0 }}
          >
            <div className="mb-4 mt-4 flex w-full flex-col justify-end gap-y-2 border-t border-zinc-600 pt-4">
              {navigation.map((nav, index) => (
                <Link
                  href={nav.href}
                  key={index}
                  className="rounded-full p-2 leading-none transition-colors duration-100 hover:text-zinc-300 active:bg-zinc-50 active:text-zinc-950"
                >
                  {nav.label}
                </Link>
              ))}
              {!session && (
                <Link href="/auth" className="mt-2">
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700/50 hover:text-zinc-50"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
