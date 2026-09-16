"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { resetStaffPassword } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Eye, EyeOff, Loader2, X, CheckCircle2 } from "lucide-react";

interface ResetPasswordModalProps {
  userId: string;
  userName: string;
  employeeId?: string | null;
  mobile: string;
}

export function ResetPasswordModal({
  userId,
  userName,
  employeeId,
  mobile,
}: ResetPasswordModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleOpen = () => {
    setPassword("");
    setShowPassword(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (!isPending) setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    startTransition(async () => {
      try {
        await resetStaffPassword(userId, password);
        toast.success(`Password successfully updated for ${userName}!`);
        setIsOpen(false);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to reset password";
        toast.error(msg);
      }
    });
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleOpen}
        className="h-8 text-xs gap-1.5 border-border/80 hover:bg-accent/40"
      >
        <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
        <span><span className="hidden sm:inline">Reset </span>Password</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-150 relative"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden disabled:pointer-events-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>

            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Reset Staff Password</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Update credentials for <strong className="text-foreground">{userName}</strong> (
                  <span className="font-mono">{employeeId || mobile}</span>)
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`pwd-${userId}`} className="text-xs font-medium text-foreground">
                    New Password
                  </Label>
                  <span className="text-[11px] text-muted-foreground">Min. 6 characters</span>
                </div>
                <div className="relative">
                  <Input
                    id={`pwd-${userId}`}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                    autoFocus
                    disabled={isPending}
                    className="h-9 pr-10 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isPending}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/30 p-3 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Staff Login Hint:
                </div>
                <p className="mt-1">
                  The staff member can log in at <code className="text-foreground font-mono">/login</code> using either their Employee ID (<span className="font-mono font-medium text-foreground">{employeeId}</span>) or Mobile Number (<span className="font-mono font-medium text-foreground">{mobile}</span>).
                </p>
              </div>

              <div className="mt-2 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  disabled={isPending}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending || password.length < 6}
                  className="h-8 text-xs gap-1.5"
                >
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {isPending ? "Saving..." : "Save Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
