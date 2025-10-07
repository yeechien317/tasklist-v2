import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export type AuthMode = "signin" | "signup";
export type AuthMethod = "email" | "google" | "phone";

interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  username?: string;
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const { toast } = useToast();

  // Email/Password Sign In
  const signInWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }

      const data = await response.json();
      setUser(data.user);

      toast({
        title: "Success",
        description: "Successfully signed in!",
      });

      return data.user;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to sign in",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Email/Password Sign Up
  const signUpWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Registration failed");
      }

      const data = await response.json();
      setUser(data.user);

      toast({
        title: "Success",
        description: "Account created successfully!",
      });

      return data.user;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign In
  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Google OAuth flow
      // For now, this is a placeholder
      toast({
        title: "Coming Soon",
        description: "Google sign-in will be available soon!",
      });

      // Example Google OAuth implementation:
      // 1. Redirect to Google OAuth consent screen
      // window.location.href = `/api/auth/google`;

      // 2. Handle callback from Google
      // const urlParams = new URLSearchParams(window.location.search);
      // const code = urlParams.get('code');

      // 3. Exchange code for tokens
      // const response = await fetch('/api/auth/google/callback', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ code })
      // });

      throw new Error("Google sign-in not yet implemented");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to sign in with Google",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Phone Number Sign In (WhatsApp)
  const signInWithPhone = async (phone: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement phone/WhatsApp authentication
      // This would typically involve:
      // 1. Send verification code to phone via SMS/WhatsApp
      const response = await fetch("/api/auth/phone/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) {
        throw new Error("Failed to send verification code");
      }

      toast({
        title: "Code Sent",
        description: "Verification code sent to your phone!",
      });

      return { success: true, phone };
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send code",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify Phone Code
  const verifyPhoneCode = async (phone: string, code: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/phone/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Invalid verification code");
      }

      const data = await response.json();
      setUser(data.user);

      toast({
        title: "Success",
        description: "Phone verified successfully!",
      });

      return data.user;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to verify code",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Out
  const signOut = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithPhone,
    verifyPhoneCode,
    signOut,
  };
}

export default useLogin;
