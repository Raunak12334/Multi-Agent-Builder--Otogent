"use client";

import {
  GlobeIcon,
  LockIcon,
  PaletteIcon,
  SaveIcon,
  SparklesIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function PlatformSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Global settings synchronized successfully.");
    }, 1500);
  };

  return (
    <div className="p-8 space-y-8 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 text-gradient bg-clip-text">
            System Configuration
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Global orchestration and platform-wide environment variables.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
        >
          {isSaving ? (
            "Synchronizing..."
          ) : (
            <>
              <SaveIcon className="size-4" /> Deploy Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <div className="flex items-center gap-2">
              <GlobeIcon className="size-5 text-blue-500" />
              <CardTitle>Platform Branding</CardTitle>
            </div>
            <CardDescription>
              Visual identity and public-facing site metadata.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input
                defaultValue="Otogent"
                className="bg-slate-50 dark:bg-slate-800 border-none"
              />
            </div>
            <div className="space-y-2">
              <Label>Support Email</Label>
              <Input
                defaultValue="support@otogent.com"
                className="bg-slate-50 dark:bg-slate-800 border-none"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl mt-4">
              <div className="space-y-0.5">
                <Label className="text-sm">Maintenance Mode</Label>
                <p className="text-[10px] text-slate-500">
                  Temporarily disable public access
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <div className="flex items-center gap-2">
              <SparklesIcon className="size-5 text-purple-500" />
              <CardTitle>AI Core Configuration</CardTitle>
            </div>
            <CardDescription>
              Platform-wide management of AI orchestration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="space-y-0.5">
                <Label className="text-sm">Allow Multi-Agent Chains</Label>
                <p className="text-[10px] text-slate-500">
                  Enable advanced workflow capabilities
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="space-y-0.5">
                <Label className="text-sm">Global Rate Limiting</Label>
                <p className="text-[10px] text-slate-500">
                  Apply safety limits to all AI calls
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2 pt-2">
              <Label>Internal Model Override</Label>
              <Input
                placeholder="gpt-4-turbo"
                className="bg-slate-50 dark:bg-slate-800 border-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <div className="flex items-center gap-2">
              <LockIcon className="size-5 text-emerald-500" />
              <CardTitle>Security & Compliance</CardTitle>
            </div>
            <CardDescription>
              Access control and forensic data retention.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="space-y-0.5">
                <Label className="text-sm">Audit Log Retention</Label>
                <p className="text-[10px] text-slate-500">
                  Keep history for 90 days
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="space-y-0.5">
                <Label className="text-sm">Require 2FA for Admins</Label>
                <p className="text-[10px] text-slate-500">
                  Enforce biometric or SMS MFA
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PaletteIcon className="size-5 text-amber-500" />
              <CardTitle>Aesthetics & Theme</CardTitle>
            </div>
            <CardDescription>
              Control the look and feel of the platform interface.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="space-y-0.5">
                <Label className="text-sm">Glassmorphism Effects</Label>
                <p className="text-[10px] text-slate-500">
                  Enable modern blurred backgrounds
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="space-y-0.5">
                <Label className="text-sm">Smooth Animations</Label>
                <p className="text-[10px] text-slate-500">
                  Enable framer-motion transitions
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
