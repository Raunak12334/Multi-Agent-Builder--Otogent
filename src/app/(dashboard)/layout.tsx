import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { enforceAppRouting } from "@/lib/auth-utils";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  await enforceAppRouting("/workflows");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-slate-50/50 dark:bg-slate-950/50">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
