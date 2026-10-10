import { ThemeProvider } from '../ThemeProvider';

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <div className="p-4 bg-background text-foreground rounded-md border">
        <h2 className="text-lg font-semibold mb-2">Theme Provider Example</h2>
        <p className="text-muted-foreground">This demonstrates the theme provider working. The theme will persist across page reloads.</p>
      </div>
    </ThemeProvider>
  );
}