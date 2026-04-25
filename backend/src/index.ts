import "dotenv/config";
import cors from "cors";
import express from "express";
import { getAuth } from "./firebaseAdmin.js";

const app = express();
app.use(express.json());

const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";
app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  }),
);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

async function requireFirebaseAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const header = req.header("authorization") ?? "";
  const match = header.match(/^Bearer (.+)$/i);
  if (!match) return res.status(401).json({ error: "Missing Bearer token" });

  try {
    const decoded = await getAuth().verifyIdToken(match[1]);
    (req as any).firebaseUser = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

app.get("/me", requireFirebaseAuth, (req, res) => {
  const decoded = (req as any).firebaseUser as { uid: string; email?: string };
  res.json({ uid: decoded.uid, email: decoded.email ?? null });
});

const port = Number(process.env.PORT ?? 8080);
app.listen(port, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://0.0.0.0:${port}`);
});

