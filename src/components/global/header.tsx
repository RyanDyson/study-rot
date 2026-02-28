"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbSegment {
  label: string;
  href: string;
  isLast: boolean;
}

const BreadCrumbGenerator = (pathname: string): BreadcrumbSegment[] => {
  if (pathname === "/") {
    return [
      { label: "Home", href: "/", isLast: true },
    ];
  }

  const segments = pathname.split("/").filter(Boolean);
  const isDashboard = segments[0] === "dashboard";
  const rootHref = isDashboard ? "/dashboard" : "/";

  const breadcrumbs: BreadcrumbSegment[] = [
    {
      label: isDashboard ? "Dashboard" : segments[0] ?? "Dashboard",
      href: rootHref,
      isLast: segments.length <= 1,
    },
  ];

  const startIndex = isDashboard ? 1 : 0;
  for (let i = startIndex; i < segments.length; i++) {
    const segment = segments[i];
    if (!segment) continue;

    const href = "/" + segments.slice(0, i + 1).join("/");
    const isLast = i === segments.length - 1;

    if (segment === "room" && i + 1 < segments.length) {
      const slug = segments[i + 1];
      if (!slug) continue;

      const combinedHref = "/" + segments.slice(0, i + 2).join("/");
      const combinedIsLast = i + 1 === segments.length - 1;

      const formattedSlug = slug
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      breadcrumbs.push({
        label: `Room - ${formattedSlug}`,
        href: combinedHref,
        isLast: combinedIsLast,
      });

      i++;
    } else {
      const label = segment
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      breadcrumbs.push({
        label,
        href,
        isLast,
      });
    }
  }

  return breadcrumbs;
};

export function AppHeader() {
  const pathname = usePathname();
  const breadcrumbs = BreadCrumbGenerator(pathname);

  return (
    <header className="flex h-10 shrink-0 items-center border-b border-border bg-background/70 px-4 backdrop-blur-2xl lg:px-6">
      <div className="flex w-full items-center">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={index} className="flex items-center">
                <BreadcrumbItem>
                  {breadcrumb.isLast ? (
                    <BreadcrumbPage className="font-medium text-white hover:">
                      {breadcrumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={breadcrumb.href}
                      className="text-white font-medium hover:underline hover:text-white"
                    >
                      {breadcrumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!breadcrumb.isLast && (
                  <BreadcrumbSeparator className="text-white" />
                )}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
