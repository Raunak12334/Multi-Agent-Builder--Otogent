"use client";

import {
  Copy,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Share2,
  ShieldAlert,
  Trash,
  UserPlus,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getErrorMessage } from "@/lib/utils";
import {
  changeUserRole,
  inviteTeamMember,
  removeUserFromWorkspace,
  revokeInvite,
} from "../actions";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
};

type Invite = {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
  expiresAt: Date;
};

const joinedDateFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "UTC",
});

export function TeamManagementClient({
  users,
  invites,
  currentUserId,
  currentUserRole,
  organizationId,
}: {
  users: User[];
  invites: Invite[];
  currentUserId: string;
  currentUserRole: string;
  organizationId: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [_copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = currentUserRole === "ADMIN";

  const copyInviteLink = (email: string, id: string) => {
    const link = `${window.location.origin}/signup?email=${encodeURIComponent(email)}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    toast.success("Invite link copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareViaWhatsApp = (email: string) => {
    const link = `${window.location.origin}/signup?email=${encodeURIComponent(email)}`;
    const text = `Join our team on Otogent! Here's your invite link: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareViaEmail = (email: string) => {
    const link = `${window.location.origin}/signup?email=${encodeURIComponent(email)}`;
    const subject = "Invitation to join our team on Otogent";
    const body = `Hi! I've invited you to join our team on Otogent. You can join using this link: ${link}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl max-w-lg shadow-sm" />
        <div className="border rounded-xl shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
          <div className="h-64 bg-slate-50 dark:bg-slate-950/50" />
        </div>
      </div>
    );
  }

  const handleInvite = () => {
    if (!inviteEmail) return;
    startTransition(async () => {
      try {
        const result = await inviteTeamMember(inviteEmail, organizationId);

        // Automatically trigger mailto redirect
        if (result.inviteLink) {
          const subject = "Invitation to join our team on Otogent";
          const body = `Hi! I've invited you to join our team on Otogent. You can join using this link: ${result.inviteLink}`;
          window.location.href = `mailto:${inviteEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }

        toast.success(`Invite created for ${inviteEmail}`, {
          description:
            "Mail client opened. You can also copy the link manually if needed.",
          action: {
            label: "Copy Link",
            onClick: () => {
              if (result.inviteLink) {
                navigator.clipboard.writeText(result.inviteLink);
                toast.success("Invite link copied");
              }
            },
          },
        });
        setInviteEmail("");
      } catch (error: unknown) {
        toast.error(getErrorMessage(error, "Failed to send invite"));
      }
    });
  };

  const handleChangeRole = (userId: string, newRole: "ADMIN" | "USER") => {
    startTransition(async () => {
      try {
        await changeUserRole(userId, newRole);
        toast.success("Role updated successfully.");
      } catch (_e) {
        toast.error("Failed to update role");
      }
    });
  };

  const handleRemoveUser = (userId: string) => {
    startTransition(async () => {
      try {
        await removeUserFromWorkspace(userId);
        toast.success("User removed from workspace.");
      } catch (_e) {
        toast.error("Failed to remove user");
      }
    });
  };

  const handleRevokeInvite = (inviteId: string) => {
    startTransition(async () => {
      try {
        await revokeInvite(inviteId);
        toast.success("Invitation revoked.");
      } catch (_e) {
        toast.error("Failed to revoke invitation");
      }
    });
  };

  return (
    <div className="space-y-6">
      {isAdmin && (
        <div className="flex border rounded-xl overflow-hidden max-w-lg shadow-sm">
          <Input
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-12"
            placeholder="colleague@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <Button onClick={handleInvite} className="h-12 rounded-none px-6">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite
          </Button>
        </div>
      )}

      <div className="border rounded-xl shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {user.name || "Pending User"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {joinedDateFormatter.format(new Date(user.createdAt))}
                </TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {user.id !== currentUserId && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangeRole(
                                  user.id,
                                  user.role === "ADMIN" ? "USER" : "ADMIN",
                                )
                              }
                            >
                              <ShieldAlert className="mr-2 h-4 w-4" />
                              {user.role === "ADMIN"
                                ? "Demote to User"
                                : "Promote to Admin"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleRemoveUser(user.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Remove from Workspace
                            </DropdownMenuItem>
                          </>
                        )}
                        {user.id === currentUserId && (
                          <DropdownMenuItem disabled>
                            Cannot modify yourself
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {invites.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pending Invitations</h2>
          <div className="border rounded-xl shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  {isAdmin && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="font-medium">
                      {invite.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{invite.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invite.status === "PENDING" ? "outline" : "secondary"
                        }
                      >
                        {invite.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {joinedDateFormatter.format(new Date(invite.expiresAt))}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {invite.status === "PENDING" && (
                            <>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>
                                    Share Invite
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      copyInviteLink(invite.email, invite.id)
                                    }
                                  >
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy Link
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      shareViaWhatsApp(invite.email)
                                    }
                                  >
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    WhatsApp
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => shareViaEmail(invite.email)}
                                  >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Email
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive h-8 px-2"
                                onClick={() => handleRevokeInvite(invite.id)}
                                disabled={isPending}
                              >
                                Revoke
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
