import express from "express";
import cors from "cors"
import "dotenv/config"
import { connectDB } from "./lib/db.js";
import { clerkMiddleware, clerkClient, getAuth } from '@clerk/express'

const app = express()

const PORT = process.env.PORT
const FRONTEND_URL = process.env.FRONTEND_URL

app.use(express.json())
app.use(cors(
    {
        origin:FRONTEND_URL,
        credentials:true
    }
))
app.use(clerkMiddleware())

app.get('/protected', async (req, res) => {
  const { isAuthenticated, userId } = getAuth(req)

  if (!isAuthenticated) {
    res.status(401).json({ error: 'User not authenticated' })
    return
  }
  const user = await clerkClient.users.getUser(userId)

  res.json({ user })
})

async function startServer() {
    try {
        await connectDB(); 
        
        app.listen(PORT, () => {
            console.log(`Сервер запущен успешно на порту ${PORT}!`);
        });
    } catch (error) {
        console.error("Не удалось запустить сервер:", error);
        process.exit(1);
    }
}

startServer();