import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT.
  // If that port is already in use, retry a small range of nearby ports so the app
  // can still start without crashing in a local dev environment.
  const preferredPort = parseInt(process.env.PORT || '5000', 10);
  const maxPortAttempts = 20;

  const listenOnPort = (port: number, attemptsRemaining: number) => {
    const listenOptions = {
      port,
      host: "0.0.0.0",
      ...(process.platform !== "win32" ? { reusePort: true } : {}),
    };

    server.once("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        if (attemptsRemaining > 0) {
          const nextPort = port + 1;
          log(`Port ${port} is already in use; trying ${nextPort} instead`, "server");
          listenOnPort(nextPort, attemptsRemaining - 1);
          return;
        }

        throw new Error(`Could not find a free port in the range ${preferredPort}-${preferredPort + maxPortAttempts - 1}`);
      }

      throw err;
    });

    server.listen(listenOptions, () => {
      log(`serving on port ${port}`);
    });
  };

  listenOnPort(preferredPort, maxPortAttempts);
})();
