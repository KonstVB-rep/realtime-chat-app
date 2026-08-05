import { CronJob } from "cron";
import http from "node:http";
import https from "node:https";

const job = new CronJob("*/14 * * * *", function () {
  const base = process.env.BACKEND_URL;
  if (!base) return;
  const url = new URL("/revival", base).href;
  const client = url.startsWith("https:") ? https : http;

  client
    .get(url, (res) => {
      if (res.statusCode === 200) console.log("GET request sent successfully");
      else console.log("GET request failed", res.statusCode);
    })
    .on("error", (e) => console.error("Error while sending request", e));
});

export default job;