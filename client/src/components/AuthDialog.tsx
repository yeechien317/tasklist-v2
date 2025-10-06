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
import { Separator } from "@/components/ui/separator";
import { Mail, MessageCircle } from "lucide-react";
import { SiGoogle } from "react-icons/si";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [authMode, setAuthMode] = useState<"main" | "email" | "phone">("main");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleGoogleAuth = () => {
    console.log("Google authentication triggered");
    // TODO: Implement Google OAuth
  };

  const handleWhatsAppAuth = () => {
    console.log("WhatsApp authentication triggered");
    setAuthMode("phone");
  };

  const handleEmailAuth = () => {
    setAuthMode("email");
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email auth submitted:", { email, password });
    // TODO: Implement email authentication
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Phone auth submitted:", { phone });
    // TODO: Implement WhatsApp/phone authentication
  };

  const resetToMain = () => {
    setAuthMode("main");
    setEmail("");
    setPassword("");
    setPhone("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-auth">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {authMode === "main" && "Welcome to TaskFlow"}
            {authMode === "email" && "Sign in with Email"}
            {authMode === "phone" && "Sign in with WhatsApp"}
          </DialogTitle>
          <DialogDescription>
            {authMode === "main" &&
              "Choose your preferred sign-in method to get started"}
            {authMode === "email" &&
              "Enter your email and password to continue"}
            {authMode === "phone" &&
              "Enter your phone number to receive a verification code"}
          </DialogDescription>
        </DialogHeader>

        {authMode === "main" && (
          <div className="space-y-4 py-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 bg-background hover-elevate active-elevate-2"
              onClick={handleGoogleAuth}
              data-testid="button-auth-google"
            >
              <SiGoogle className="h-5 w-5" />
              <span>Continue with Google</span>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 bg-background hover-elevate active-elevate-2"
              onClick={handleWhatsAppAuth}
              data-testid="button-auth-whatsapp"
            >
              <MessageCircle className="h-5 w-5 text-[#25D366]" />
              <span>Continue with WhatsApp</span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 bg-background hover-elevate active-elevate-2"
              onClick={handleEmailAuth}
              data-testid="button-auth-email"
            >
              <Mail className="h-5 w-5" />
              <span>Continue with Email</span>
            </Button>
          </div>
        )}

        {authMode === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-password"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={resetToMain}
                data-testid="button-back"
              >
                Back
              </Button>
              <Button type="submit" className="flex-1" data-testid="button-submit">
                Sign In
              </Button>
            </div>
          </form>
        )}

        {authMode === "phone" && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                data-testid="input-phone"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              We'll send you a verification code via WhatsApp
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={resetToMain}
                data-testid="button-back"
              >
                Back
              </Button>
              <Button type="submit" className="flex-1" data-testid="button-submit">
                Send Code
              </Button>
            </div>
          </form>
        )}

        {authMode === "main" && (
          <p className="text-center text-sm text-muted-foreground">
            Free forever. No credit card required.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
