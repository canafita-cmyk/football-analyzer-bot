import express from "express"

const app = express()

app.use(express.json())

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "football-analyzer-bot" })
})

app.get("/run", async (_req, res) => {
  // aqui entra a lógica do bot
  res.json({ message: "Bot executado com sucesso" })
})

export default app
