"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface NavbarCenter {
  title: string;
  description?: string;
}

interface NavbarContextValue {
  center: NavbarCenter | null;
  setCenter: (content: NavbarCenter | null) => void;
}

const NavbarContext = createContext<NavbarContextValue>({
  center: null,
  setCenter: () => {},
});

export function NavbarProvider({ children }: { children: React.ReactNode }) {
  const [center, setCenter] = useState<NavbarCenter | null>(null);
  return (
    <NavbarContext.Provider value={{ center, setCenter }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbarCenterState() {
  return useContext(NavbarContext).center;
}

/** Call from any page to push content into the navbar center slot. Clears on unmount. */
export function useNavbarCenter(content: NavbarCenter | null) {
  const { setCenter } = useContext(NavbarContext);
  useEffect(() => {
    setCenter(content);
    return () => setCenter(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content?.title, content?.description]);
}
