import express from "express";
import "dotenv/config"

const app = express()


console.log("DB_URL=", process.env.DB_URL)

const PORT= process.env.PORT

app.listen(PORT, () => console.log("Сервер запущен успещно на порту -",PORT,"!"))