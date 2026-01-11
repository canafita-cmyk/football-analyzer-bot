import express from "express"

const app = express()

app.use(express.json())

app.get("/", (_req, res) => {
  res.json({
    status: "online",
    service: "football-analyzer-bot",
    endpoints: ["/health", "/run"]
  })
})

app.get("/health", (_req, res) => {
  res.json({ status: "ok" })
})

app.get("/run", (_req, res) => {
  res.json({ message: "Bot executado com sucesso" })
})

export default app
