import { CalendarDays, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex h-16 items-center justify-between px-5 sm:px-8 lg:hidden">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-sm">
            <CalendarDays className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold tracking-tight text-slate-950 dark:text-white">Bellboard</p>
            <p className="text-[11px] text-slate-500">School operations</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
          className="text-slate-500 hover:text-slate-950"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}