import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ===============================
  // 🟢 HEALTH CHECK
  // ===============================
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // ===============================
  // 💳 DUMMY PAYMENT API
  // ===============================
  app.post("/api/checkout", async (req, res) => {
    console.log("💳 Dummy payment request received");

    const { items } = req.body;

    // Fake delay (simulate real gateway)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate fake transaction
    const transactionId = "TXN" + Date.now();

    console.log("✅ Payment success:", transactionId);

    res.json({
      success: true,
      transactionId,
      message: "Payment successful (dummy)",
    });
  });

  // ===============================
  // 📧 DUMMY EMAIL API
  // ===============================
  app.post("/api/send-email", async (req, res) => {
    const { to, subject, html } = req.body;

    console.log("📧 Dummy Email Sent:");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Body:", html);

    // Fake delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    res.json({
      success: true,
      message: "Email simulated successfully",
    });
  });

  // ===============================
  // 🎫 OPTIONAL: STORE BOOKINGS (IN MEMORY)
  // ===============================
  const bookings: any[] = [];

  app.post("/api/book", (req, res) => {
    const booking = {
      id: "BOOK" + Date.now(),
      ...req.body,
      createdAt: new Date(),
    };

    bookings.push(booking);

    res.json({
      success: true,
      booking,
    });
  });

  app.get("/api/bookings", (req, res) => {
    res.json(bookings);
  });

  // ===============================
  // ⚡ VITE DEV / PROD SETUP
  // ===============================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // ===============================
  // 🚀 START SERVER
  // ===============================
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

startServer();