import express from "express";
import User from "../models/user.model.js";
import { verifyWebhook } from "@clerk/backend/webhooks";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET; 
    
    if (!signingSecret) {
      res.status(503).json({ message: "Webhook secret is not provided" });
      return;
    }

    // 1. Получаем сырое тело запроса как строку
    const payload = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : String(req.body);

    // 2. Преобразуем заголовки Express в формат, понятный Web API
    const headersInit: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        // Если заголовок массив (бывает редко, но TypeScript требует проверки), объединяем его
        headersInit[key] = Array.isArray(value) ? value.join(", ") : value;
      }
    }

    // 3. Создаем Web API Request объект
    const request = new Request("http://internal/webhooks/clerk", {
      method: "POST",
      headers: headersInit, // Теперь TypeScript доволен
      body: payload,
    });

    // 4. Проверяем подпись (выбросит ошибку, если что-то не так)
    const evt = await verifyWebhook(request, { signingSecret });

    // 5. Обрабатываем события
    if (evt.type === "user.created" || evt.type === "user.updated") {
      const u = evt.data;

      const email =
        u.email_addresses?.find((e) => e.id === u.primary_email_address_id)?.email_address ??
        u.email_addresses?.[0]?.email_address;

      const fullName =
        [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || email?.split("@")[0];

      await User.findOneAndUpdate(
        { clerkId: u.id },
        { 
          clerkId: u.id, 
          email, 
          fullName, 
          profilePic: u.image_url 
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      console.log(`Пользователь ${u.id} успешно синхронизирован с БД`);
    }

    if (evt.type === "user.deleted") {
      if (evt.data.id) {
        await User.findOneAndDelete({ clerkId: evt.data.id });
        console.log(`Пользователь ${evt.data.id} удален из БД`);
      }
    }

    // 6. Успешный ответ для Clerk
    res.status(200).json({ received: true });
    
  } catch (error) {
    console.error("Error in Clerk webhook:", error);
    res.status(400).json({ message: "Webhook verification failed" });
  }
});

export default router;