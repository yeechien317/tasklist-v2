import { useState } from "react";
import { AuthDialog } from "../AuthDialog";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "../ThemeProvider";

export default function AuthDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="flex items-center justify-center min-h-screen bg-background p-8">
        <Button onClick={() => setOpen(true)} data-testid="button-open-dialog">
          Open Auth Dialog
        </Button>
        <AuthDialog open={open} onOpenChange={setOpen} />
      </div>
    </ThemeProvider>
  );
}
