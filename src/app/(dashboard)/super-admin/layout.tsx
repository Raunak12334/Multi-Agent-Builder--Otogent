import { requireSuperAdmin } from "@/lib/auth-utils";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will throw if not super-admin
  await requireSuperAdmin();

  return (
    <div className="flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-950/50">
      {children}
    </div>
  );
}
