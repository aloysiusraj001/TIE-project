import "dotenv/config";
import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAuth, getFirestore } from "./firebaseAdmin.js";

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

const palette = [
  "217 60% 22%",
  "188 70% 38%",
  "262 55% 45%",
  "152 55% 36%",
  "35 90% 48%",
  "0 70% 48%",
];

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

async function requireAdminRole(req: express.Request, res: express.Response, next: express.NextFunction) {
  const decoded = (req as any).firebaseUser as { email?: string };
  const email = decoded.email?.toLowerCase();
  if (!email) return res.status(403).json({ error: "Missing email in token" });

  const db = getFirestore();
  const snap = await db.collection("users").where("email", "==", email).limit(1).get();
  const doc = snap.docs[0];
  const role = doc?.get("role") as string | undefined;
  if (role !== "admin") return res.status(403).json({ error: "Admin role required" });
  return next();
}

app.post("/admin/users", requireFirebaseAuth, requireAdminRole, async (req, res) => {
  const { name, email, role } = (req.body ?? {}) as { name?: string; email?: string; role?: string };
  if (!name?.trim() || !email?.trim() || !role?.trim()) {
    return res.status(400).json({ error: "name, email, and role are required" });
  }

  const id = uid("u");
  const db = getFirestore();
  const usersCol = db.collection("users");
  const count = (await usersCol.count().get()).data().count;
  const avatarColor = palette[count % palette.length];

  await usersCol.doc(id).set({
    id,
    name: name.trim(),
    email: email.trim(),
    role: role.trim(),
    avatarColor,
  });

  return res.json({ ok: true, id });
});

// Serve built frontend from the same Cloud Run service (optional but recommended).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticDir = path.resolve(__dirname, "../../public");
app.use(express.static(staticDir));
app.get("*", (_req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

const port = Number(process.env.PORT ?? 8080);
app.listen(port, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://0.0.0.0:${port}`);
});

