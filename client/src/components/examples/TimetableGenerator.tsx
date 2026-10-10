import TimetableGenerator from '../TimetableGenerator';
import { ThemeProvider } from '../ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';

export default function TimetableGeneratorExample() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <TimetableGenerator />
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}