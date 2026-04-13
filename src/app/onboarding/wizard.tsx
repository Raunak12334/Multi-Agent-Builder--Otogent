"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getErrorMessage } from "@/lib/utils";
import { submitOnboardingForm } from "./actions";

function isRedirectError(error: unknown): error is {
  digest: string;
} {
  if (typeof error !== "object" || error === null || !("digest" in error)) {
    return false;
  }

  return typeof error.digest === "string";
}

export function OnboardingWizard({
  hasInvite = false,
  token,
}: {
  hasInvite?: boolean;
  token?: string;
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    companySize: "",
    role: "",
    useCase: "",
    token: token,
  });

  const handleNext = () => setStep(step + 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitOnboardingForm(formData);
    } catch (error: unknown) {
      // In Next.js, redirect() throws an error that should not be caught if we want the redirect to work.
      // However, when calling from a client component, we can check if it's a redirect error.
      if (isRedirectError(error) && error.digest.includes("NEXT_REDIRECT")) {
        return;
      }

      console.error("Onboarding error:", error);
      toast.error(
        getErrorMessage(
          error,
          "Failed to submit onboarding form. Please try again.",
        ),
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-xl rounded-2xl overflow-hidden relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 text-center space-y-6"
            >
              <h2 className="text-3xl font-display font-medium tracking-tight">
                Welcome to Otogent <br />
                <span className="text-muted-foreground text-2xl">
                  Build Your AI Workforce
                </span>
              </h2>
              <p className="text-muted-foreground">
                {hasInvite
                  ? "You've been invited to join an organization. Complete your profile to get started."
                  : "Set up your workspace and get ready to automate your hardest work."}
              </p>
              <Button
                onClick={handleNext}
                className="w-full py-6 text-lg rounded-xl"
              >
                Get Started
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 space-y-4"
            >
              <h2 className="text-2xl font-semibold mb-6 tracking-tight">
                {hasInvite ? "Your Profile" : "Organization Profile"}
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    placeholder="Jane Doe"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>
                {!hasInvite && (
                  <>
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input
                        placeholder="Acme Corp"
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company Size</Label>
                        <Select
                          onValueChange={(val) =>
                            setFormData({ ...formData, companySize: val })
                          }
                          value={formData.companySize}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10</SelectItem>
                            <SelectItem value="10-50">10-50</SelectItem>
                            <SelectItem value="50+">50+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Your Role</Label>
                        <Input
                          placeholder="CTO"
                          value={formData.role}
                          onChange={(e) =>
                            setFormData({ ...formData, role: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </>
                )}
                {hasInvite && (
                  <div className="space-y-2">
                    <Label>Your Role</Label>
                    <Input
                      placeholder="Product Manager"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Primary Use Case</Label>
                  <Select
                    onValueChange={(val) =>
                      setFormData({ ...formData, useCase: val })
                    }
                    value={formData.useCase}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select use case" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Customer Support">
                        Customer Support
                      </SelectItem>
                      <SelectItem value="Data Entry">Data Entry</SelectItem>
                      <SelectItem value="Sales Outreach">
                        Sales Outreach
                      </SelectItem>
                      <SelectItem value="Content Creation">
                        Content Creation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleSubmit}
                  className="w-full py-6 text-lg rounded-xl mt-4"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : hasInvite ? (
                    "Join Organization"
                  ) : (
                    "Create Workspace"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress indicator */}
        <div className="h-1 bg-slate-100 flex w-full absolute bottom-0 left-0">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "33%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}
