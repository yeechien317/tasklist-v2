import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string) => void;
}

export function AuthLoginDialog({ open, onOpenChange, onLogin, onRegister }: AuthLoginDialogProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      onRegister(email, password);
    } else {
      onLogin(email, password);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      setIsRegistering(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-auth-login">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isRegistering ? "Create Account" : "Welcome Back"}
          </DialogTitle>
          <DialogDescription>
            {isRegistering
              ? "Create a new account to start managing your tasks"
              : "Sign in to your account to manage your tasks"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="input-auth-email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-testid="input-auth-password"
            />
          </div>
          <Button type="submit" className="w-full" data-testid="button-auth-submit">
            {isRegistering ? "Create Account" : "Sign In"}
          </Button>
        </form>
        <div className="text-center text-sm">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-primary hover:underline"
            data-testid="button-toggle-auth-mode"
          >
            {isRegistering
              ? "Already have an account? Sign in"
              : "Don't have an account? Create one"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
