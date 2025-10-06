import { ThemeProvider } from "../ThemeProvider";
import { LandingPage } from "../LandingPage";

export default function LandingPageExample() {
  return (
    <ThemeProvider>
      <LandingPage onOpenAuth={() => console.log("Open auth dialog")} />
    </ThemeProvider>
  );
}
