import express, { type Request, type Response, type NextFunction } from "express";
import { pathToFileURL } from "url";
import { registerRoutes } from "./routes.ts";
import { setupVite, serveStatic, log } from "./vite.ts";

export async function createApp() {
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

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  return app;
}

export async function startServer() {
  const app = await createApp();
  const preferredPort = parseInt(process.env.PORT || "5000", 10);
  const maxPortAttempts = 20;

  const listenOnPort = (port: number, attemptsRemaining: number) => {
    const server = app.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });

    server.on("error", (err: NodeJS.ErrnoException) => {
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
  };

  listenOnPort(preferredPort, maxPortAttempts);
}

export default async function appHandler(req: any, res: any, next: any) {
  const app = await createApp();
  return app(req, res, next);
}

const isDirectRun =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  startServer();
}
