import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Calendar,
  Bell,
  Smartphone,
  Zap,
  Shield,
} from "lucide-react";
import { AuthDialog } from "./AuthDialog";
import { ThemeToggle } from "./ThemeToggle";
import heroImage from "@assets/generated_images/Productive_workspace_with_task_app_b4fdfd1b.png";

export function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);

  const features = [
    {
      icon: CheckCircle2,
      title: "Simple Task Management",
      description:
        "Create, organize, and complete tasks with an intuitive interface designed for productivity.",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description:
        "Set due dates and get timely reminders so nothing falls through the cracks.",
    },
    {
      icon: Bell,
      title: "Stay Notified",
      description:
        "Receive notifications for upcoming tasks and deadlines across all your devices.",
    },
    {
      icon: Smartphone,
      title: "Works Everywhere",
      description:
        "Access your tasks from any device with our responsive, cross-platform design.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Built for speed with instant sync and smooth interactions that keep you in flow.",
    },
    {
      icon: Shield,
      title: "Always Free",
      description:
        "Full-featured task management with no hidden costs or premium tiers. Forever.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TaskFlow</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setAuthOpen(true)}
              data-testid="button-signin"
            >
              Sign In
            </Button>
            <Button
              onClick={() => setAuthOpen(true)}
              data-testid="button-signup"
            >
              Get Started
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Organize Your Life with{" "}
                <span className="text-primary">Simple Task Management</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Stay productive with TaskFlow - a beautiful, free task manager
                designed for your daily workflow. Sign in with Google, WhatsApp,
                or email to get started.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => setAuthOpen(true)}
                  data-testid="button-hero-cta"
                >
                  Start Organizing - It's Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  data-testid="button-learn-more"
                >
                  Learn More
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                ✓ No credit card required ✓ Free forever ✓ 2-minute setup
              </p>
            </div>
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img
                  src={heroImage}
                  alt="Productive workspace with TaskFlow app"
                  className="w-full h-auto"
                  data-testid="img-hero"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need to Stay Productive
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              TaskFlow combines simplicity with powerful features to help you
              manage tasks effortlessly.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover-elevate"
                data-testid={`card-feature-${index}`}
              >
                <CardContent className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">
                Multiple Ways to Sign In
              </h2>
              <p className="text-lg text-muted-foreground">
                Choose the authentication method that works best for you. Sign
                in with Google for instant access, use WhatsApp for quick phone
                verification, or create an account with your email.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Google Sign-In:</strong> One-click authentication
                    with your Google account
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>WhatsApp Verification:</strong> Secure phone-based
                    authentication via WhatsApp
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Email & Password:</strong> Traditional sign-up with
                    full control over your account
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-card rounded-lg p-8 border">
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">
                    Ready to get started?
                  </h3>
                  <p className="text-muted-foreground">
                    Choose your preferred sign-in method
                  </p>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setAuthOpen(true)}
                  data-testid="button-benefits-cta"
                >
                  Sign Up Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">
              Start Managing Your Tasks Today
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of users who organize their lives with TaskFlow.
              Simple, powerful, and completely free.
            </p>
            <Button
              size="lg"
              onClick={() => setAuthOpen(true)}
              data-testid="button-final-cta"
            >
              Get Started for Free
            </Button>
            <p className="text-sm text-muted-foreground">
              No credit card required • Free forever • Takes 2 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="font-semibold">TaskFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 TaskFlow. Simple task management for everyone.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Dialog */}
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
