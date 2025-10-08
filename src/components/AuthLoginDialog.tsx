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
import { Mail, Phone } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { useLogin } from "@/components/ui/useLogin";

interface AuthLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess?: (user: any) => void;
  initialMode?: "signin" | "signup-method" | "signup-email" | "signup-phone";
}

export function AuthLoginDialog({
  open,
  onOpenChange,
  onLoginSuccess,
  initialMode = "signin",
}: AuthLoginDialogProps) {
  const [authMode, setAuthMode] = useState<"signin" | "signup-method" | "signup-email" | "signup-phone">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithPhone,
    verifyPhoneCode,
    isLoading
  } = useLogin();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await signInWithEmail(email, password);

      if (user && onLoginSuccess) {
        onLoginSuccess(user);
      }

      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignUpEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await signUpWithEmail(email, password);

      if (user && onLoginSuccess) {
        onLoginSuccess(user);
      }

      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Sign up error:", error);
    }
  };

  const handleSignUpPhone = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!codeSent) {
      // Send verification code
      try {
        await signInWithPhone(phone);
        setCodeSent(true);
      } catch (error) {
        console.error("Phone verification error:", error);
      }
    } else {
      // Verify code and register
      try {
        const user = await verifyPhoneCode(phone, verificationCode);

        if (user && onLoginSuccess) {
          onLoginSuccess(user);
        }

        resetForm();
        onOpenChange(false);
      } catch (error) {
        console.error("Verification error:", error);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const user = await signInWithGoogle();

      if (user && onLoginSuccess) {
        onLoginSuccess(user);
      }

      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Google sign up error:", error);
    }
  };

  const resetForm = () => {
    setAuthMode(initialMode);
    setEmail("");
    setPassword("");
    setPhone("");
    setVerificationCode("");
    setCodeSent(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-auth-login">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {authMode === "signin" && "Welcome Back"}
            {authMode === "signup-method" && "Create Account"}
            {authMode === "signup-email" && "Sign Up with Email"}
            {authMode === "signup-phone" && "Sign Up with Phone"}
          </DialogTitle>
          <DialogDescription>
            {authMode === "signin" && "Enter your email and password to sign in"}
            {authMode === "signup-method" && "Choose your preferred sign-up method"}
            {authMode === "signup-email" && "Create your account with email and password"}
            {authMode === "signup-phone" && (codeSent
              ? "Enter the verification code sent to your phone"
              : "Enter your phone number to receive a verification code")}
          </DialogDescription>
        </DialogHeader>

        {/* Sign In Form (Email + Password only) */}
        {authMode === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-signin-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-signin-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-signin"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-sm pt-2">
              <button
                type="button"
                onClick={() => setAuthMode("signup-method")}
                className="text-primary hover:underline"
                data-testid="button-toggle-signup"
              >
                Don't have an account? Create one
              </button>
            </div>
          </form>
        )}

        {/* Sign Up Method Selection */}
        {authMode === "signup-method" && (
          <div className="space-y-4 py-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 bg-background hover:bg-accent"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              data-testid="button-signup-google"
            >
              <SiGoogle className="h-5 w-5" />
              <span>Continue with Google</span>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 bg-background hover:bg-accent"
              onClick={() => setAuthMode("signup-phone")}
              data-testid="button-signup-phone"
            >
              <Phone className="h-5 w-5" />
              <span>Continue with Phone</span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 bg-background hover:bg-accent"
              onClick={() => setAuthMode("signup-email")}
              data-testid="button-signup-email"
            >
              <Mail className="h-5 w-5" />
              <span>Continue with Email</span>
            </Button>

            <div className="text-center text-sm pt-2">
              <button
                type="button"
                onClick={() => setAuthMode("signin")}
                className="text-primary hover:underline"
                data-testid="button-back-signin"
              >
                Already have an account? Sign in
              </button>
            </div>
          </div>
        )}

        {/* Sign Up with Email Form */}
        {authMode === "signup-email" && (
          <form onSubmit={handleSignUpEmail} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-signup-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                data-testid="input-signup-password"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setAuthMode("signup-method")}
                data-testid="button-back"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
                data-testid="button-signup-submit"
              >
                {isLoading ? "Creating..." : "Create Account"}
              </Button>
            </div>
          </form>
        )}

        {/* Sign Up with Phone Form */}
        {authMode === "signup-phone" && (
          <form onSubmit={handleSignUpPhone} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="signup-phone">Phone Number</Label>
              <Input
                id="signup-phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={codeSent}
                data-testid="input-signup-phone"
              />
            </div>

            {codeSent && (
              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  maxLength={6}
                  data-testid="input-verification-code"
                />
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              {codeSent
                ? "Check your phone for the verification code"
                : "We'll send you a verification code via SMS"}
            </p>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setAuthMode("signup-method");
                  setCodeSent(false);
                  setPhone("");
                  setVerificationCode("");
                }}
                data-testid="button-back"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
                data-testid="button-verify"
              >
                {isLoading
                  ? "Loading..."
                  : codeSent
                  ? "Verify & Create Account"
                  : "Send Code"}
              </Button>
            </div>
          </form>
        )}

        {authMode === "signup-method" && (
          <p className="text-center text-sm text-muted-foreground">
            Free forever. No credit card required.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AuthLoginDialog;