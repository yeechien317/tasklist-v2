import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

interface LoginContainerProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string) => void;
}

export function LoginContainer({ onLogin, onRegister }: LoginContainerProps) {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {isRegistering ? "Create Account" : "Welcome to TaskFlow"}
          </CardTitle>
          <CardDescription>
            {isRegistering
              ? "Create a new account to start managing your tasks"
              : "Sign in to your account to manage your tasks"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-login-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-login-password"
              />
            </div>
            <Button type="submit" className="w-full" data-testid="button-login">
              {isRegistering ? "Create Account" : "Sign In"}
            </Button>
          </form>
          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-primary hover:underline"
              data-testid="button-toggle-mode"
            >
              {isRegistering
                ? "Already have an account? Sign in"
                : "Don't have an account? Create one"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
