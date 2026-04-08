"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  return (
    <Button 
      variant="destructive" 
      onClick={() => {
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => router.push("/login")
          }
        });
      }}
    >
      <LogOut className="h-4 w-4 mr-2" /> Sign Out
    </Button>
  );
}
