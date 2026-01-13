import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

// CORS middleware para permitir requisições do frontend
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Rota principal - Status da API
app.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "online",
    service: "football-analyzer-bot",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      matches: "/api/matches",
      stats: "/api/stats",
      predictions: "/api/predictions"
    },
    message: "Football Analyzer Bot API is running!"
  });
});

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ 
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

// Placeholder para matches
app.get("/api/matches", (_req: Request, res: Response) => {
  res.json({
    message: "Matches endpoint - Configure DATABASE_URL and API_FOOTBALL_KEY",
    data: []
  });
});

// Placeholder para stats
app.get("/api/stats", (_req: Request, res: Response) => {
  res.json({
    message: "Stats endpoint - Configure DATABASE_URL and API_FOOTBALL_KEY",
    data: []
  });
});

// Placeholder para predictions
app.get("/api/predictions", (_req: Request, res: Response) => {
  res.json({
    message: "Predictions endpoint - Configure OPENAI_API_KEY",
    data: []
  });
});

// Catch-all para rotas não encontradas
app.use("*", (_req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested endpoint does not exist",
    availableEndpoints: ["/", "/api/health", "/api/matches", "/api/stats", "/api/predictions"]
  });
});

// Export para Vercel Serverless
export default app;
