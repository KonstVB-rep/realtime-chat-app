import express from "express";
import cors from "cors"
import "dotenv/config"
import { connectDB } from "./lib/db.js";
import { clerkMiddleware, clerkClient, getAuth } from '@clerk/express'
import fs from 'fs'
import path from 'path'
import job from "./lib/cron.js";
import clerkWebhook from "./webhooks/clerk.webhook.js";

const app = express()

const PORT = process.env.PORT
const FRONTEND_URL = process.env.FRONTEND_URL

const publicDir = path.join(process.cwd(), 'public');


app.use(express.json())
app.use(cors(
    {
        origin:FRONTEND_URL,
        credentials:true
    }
))
app.use(clerkMiddleware())

app.get('/api/profile', (req, res) => {
    // getAuth извлекает данные из req.auth, которые добавил clerkMiddleware
      const auth = getAuth(req);
    const { userId, sessionId } = auth;

    if (!userId) {
        return res.status(401).json({ error: "Неавторизованный доступ" });
    }

    res.json({ 
        message: "Доступ разрешен!", 
        clerkUserId: userId,
        sessionId 
    });
});

app.get('/revival', (req, res) => {
  res.status(200).json({ ok: true });
});
app.use("/api/webhooks/clerk",express.raw({type:"application/json"}), clerkWebhook);

// app.use("/api/auth", );
// app.use("/api/messages", );

// app.get('/protected', async (req, res) => {
//   const { isAuthenticated, userId } = getAuth(req)

//   if (!isAuthenticated) {
//     res.status(401).json({ error: 'User not authenticated' })
//     return
//   }
//   const user = await clerkClient.users.getUser(userId)

//   res.json({ user })
// })

if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
}

async function startServer() {
    try {
        await connectDB(); 
        
        app.listen(PORT, () => {
            console.log(`Сервер запущен успешно на порту ${PORT}!`);
            console.log(process.env.NODE_ENV)
        });



       if(process.env.NODE_ENV === "production") job.start();
       
    } catch (error) {
        console.error("Не удалось запустить сервер:", error);
        process.exit(1);
    }
}

startServer();