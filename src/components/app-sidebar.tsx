"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "./admin-sidebar";
import { UserSidebar } from "./user-sidebar";

/**
 * AppSidebar (Smart Proxy)
 *
 * This component instantly routes to the correct sidebar based on the URL path.
 * It eliminates the slow tRPC/Role-fetching latency by making an immediate
 * decision based on the current environment.
 */
export const AppSidebar = () => {
  const pathname = usePathname();

  // If we are in the platform management suite, show the Admin dashboard
  if (pathname.startsWith("/super-admin")) {
    return <AdminSidebar />;
  }

  // Otherwise, provide the standard Otogent workspace tools
  return <UserSidebar />;
};
