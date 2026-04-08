import { requireAuth } from "@/lib/auth-utils";
import prisma from "@/lib/db";
import { TeamManagementClient } from "@/features/team/components/team-management-client";

export default async function TeamPage() {
  const session = await requireAuth();

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      organization: {
        include: {
          users: true,
          invites: {
            orderBy: {
              createdAt: "desc"
            }
          }
        },
      },
    },
  });

  if (!currentUser?.organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight font-display mb-2">Team Members</h1>
        <p className="text-muted-foreground">Manage your workspace members and their roles.</p>
      </div>
      
      <TeamManagementClient 
        users={currentUser.organization.users} 
        invites={currentUser.organization.invites}
        currentUserId={currentUser.id}
        currentUserRole={currentUser.role}
        organizationId={currentUser.organization.id}
      />
    </div>
  );
}
