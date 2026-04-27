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

// Ensure a Firestore "users" row exists for the signed-in Firebase user.
// New sign-ups default to "student"; admins can later promote via admin UI.
app.post("/users/ensure", requireFirebaseAuth, async (req, res) => {
  const decoded = (req as any).firebaseUser as { email?: string };
  const email = decoded.email?.trim();
  if (!email) return res.status(400).json({ error: "Missing email in token" });

  const db = getFirestore();
  const usersCol = db.collection("users");
  const snap = await usersCol.where("email", "==", email).limit(1).get();
  if (!snap.empty) return res.json({ ok: true, created: false });

  const id = uid("u");
  const count = (await usersCol.count().get()).data().count;
  const avatarColor = palette[count % palette.length];
  const name = email.split("@")[0]?.replace(/[._-]+/g, " ").trim() || "Student";

  await usersCol.doc(id).set({
    id,
    name,
    email,
    role: "student",
    avatarColor,
  });

  return res.json({ ok: true, created: true, id });
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

async function getCurrentUser(req: express.Request) {
  const decoded = (req as any).firebaseUser as { email?: string };
  const email = decoded.email?.toLowerCase();
  if (!email) return null;
  const db = getFirestore();
  const snap = await db.collection("users").where("email", "==", email).limit(1).get();
  const doc = snap.docs[0];
  if (!doc) return null;
  return {
    id: doc.get("id") as string | undefined,
    email: doc.get("email") as string | undefined,
    role: doc.get("role") as string | undefined,
  };
}

async function requireInstructorOrAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const u = await getCurrentUser(req);
  if (!u?.role) return res.status(403).json({ error: "Missing user profile" });
  if (u.role !== "admin" && u.role !== "instructor") {
    return res.status(403).json({ error: "Instructor or admin role required" });
  }
  (req as any).appUser = u;
  return next();
}

async function requireInstructorAssignedToCourse(req: express.Request, res: express.Response, next: express.NextFunction) {
  const u = (req as any).appUser as { id?: string; role?: string };
  const courseId = (req.params.courseId ?? req.params.id ?? "").toString().trim();
  if (!courseId) return res.status(400).json({ error: "Missing course id" });
  if (u.role === "admin") return next();
  if (!u.id) return res.status(403).json({ error: "Missing instructor id" });

  const db = getFirestore();
  const snap = await db.collection("courses").doc(courseId).get();
  if (!snap.exists) return res.status(404).json({ error: "Course not found" });
  const instructorIds = (snap.get("instructorIds") as string[] | undefined) ?? [];
  if (!instructorIds.includes(u.id)) return res.status(403).json({ error: "Not assigned to this course" });
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

app.post("/admin/courses", requireFirebaseAuth, requireAdminRole, async (req, res) => {
  const { code, name, term } = (req.body ?? {}) as { code?: string; name?: string; term?: string };
  if (!code?.trim() || !name?.trim() || !term?.trim()) {
    return res.status(400).json({ error: "code, name, and term are required" });
  }

  const id = uid("c");
  const db = getFirestore();
  await db.collection("courses").doc(id).set({
    id,
    code: code.trim(),
    name: name.trim(),
    term: term.trim(),
    instructorIds: [],
    studentIds: [],
  });

  return res.json({ ok: true, id });
});

app.post("/admin/projects", requireFirebaseAuth, requireAdminRole, async (req, res) => {
  const { name, description, courseId, studentIds } = (req.body ?? {}) as {
    name?: string;
    description?: string;
    courseId?: string;
    studentIds?: unknown;
  };
  if (!name?.trim() || !courseId?.trim()) {
    return res.status(400).json({ error: "name and courseId are required" });
  }
  const students = Array.isArray(studentIds) ? (studentIds.filter((x) => typeof x === "string") as string[]) : [];

  const id = uid("p");
  const db = getFirestore();
  await db.collection("projects").doc(id).set({
    id,
    name: name.trim(),
    description: (description ?? "").toString(),
    courseId: courseId.trim(),
    studentIds: students,
    progress: 0,
  });

  return res.json({ ok: true, id });
});

app.patch("/admin/courses/:id/instructors", requireFirebaseAuth, requireAdminRole, async (req, res) => {
  const courseId = req.params.id;
  const { instructorId, op } = (req.body ?? {}) as { instructorId?: string; op?: "add" | "remove" };
  if (!courseId?.trim() || !instructorId?.trim() || (op !== "add" && op !== "remove")) {
    return res.status(400).json({ error: "courseId, instructorId, and op(add|remove) are required" });
  }

  const db = getFirestore();
  const ref = db.collection("courses").doc(courseId.trim());
  const snap = await ref.get();
  if (!snap.exists) return res.status(404).json({ error: "Course not found" });

  const instructorIds = (snap.get("instructorIds") as string[] | undefined) ?? [];
  const next =
    op === "add"
      ? Array.from(new Set([...instructorIds, instructorId.trim()]))
      : instructorIds.filter((i) => i !== instructorId.trim());

  await ref.update({ instructorIds: next });
  return res.json({ ok: true });
});

app.patch("/admin/projects/:id/students", requireFirebaseAuth, requireAdminRole, async (req, res) => {
  const projectId = req.params.id;
  const { studentId, op } = (req.body ?? {}) as { studentId?: string; op?: "add" | "remove" };
  if (!projectId?.trim() || !studentId?.trim() || (op !== "add" && op !== "remove")) {
    return res.status(400).json({ error: "projectId, studentId, and op(add|remove) are required" });
  }

  const db = getFirestore();
  const ref = db.collection("projects").doc(projectId.trim());
  const snap = await ref.get();
  if (!snap.exists) return res.status(404).json({ error: "Project not found" });

  const studentIds = (snap.get("studentIds") as string[] | undefined) ?? [];
  const next =
    op === "add"
      ? Array.from(new Set([...studentIds, studentId.trim()]))
      : studentIds.filter((i) => i !== studentId.trim());

  await ref.update({ studentIds: next });
  return res.json({ ok: true });
});

// INSTRUCTOR-SCOPED MANAGEMENT
// Instructors can manage only courses they are assigned to (admins can use these too).

app.post("/instructor/projects", requireFirebaseAuth, requireInstructorOrAdmin, async (req, res) => {
  const { name, description, courseId, studentIds } = (req.body ?? {}) as {
    name?: string;
    description?: string;
    courseId?: string;
    studentIds?: unknown;
  };
  if (!name?.trim() || !courseId?.trim()) return res.status(400).json({ error: "name and courseId are required" });

  // Ensure instructor is assigned to the course (or admin).
  (req.params as any).id = courseId.trim();
  await new Promise<void>((resolve) =>
    requireInstructorAssignedToCourse(req, res, (err?: unknown) => {
      if (err) throw err;
      resolve();
    }),
  );
  if (res.headersSent) return;

  const students = Array.isArray(studentIds) ? (studentIds.filter((x) => typeof x === "string") as string[]) : [];
  const id = uid("p");
  const db = getFirestore();
  await db.collection("projects").doc(id).set({
    id,
    name: name.trim(),
    description: (description ?? "").toString(),
    courseId: courseId.trim(),
    studentIds: students,
    progress: 0,
  });
  return res.json({ ok: true, id });
});

app.patch(
  "/instructor/courses/:id/students",
  requireFirebaseAuth,
  requireInstructorOrAdmin,
  requireInstructorAssignedToCourse,
  async (req, res) => {
    const courseId = req.params.id;
    const { studentId, op } = (req.body ?? {}) as { studentId?: string; op?: "add" | "remove" };
    if (!courseId?.trim() || !studentId?.trim() || (op !== "add" && op !== "remove")) {
      return res.status(400).json({ error: "courseId, studentId, and op(add|remove) are required" });
    }

    const db = getFirestore();
    const ref = db.collection("courses").doc(courseId.trim());
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: "Course not found" });
    const studentIds = (snap.get("studentIds") as string[] | undefined) ?? [];
    const next =
      op === "add"
        ? Array.from(new Set([...studentIds, studentId.trim()]))
        : studentIds.filter((i) => i !== studentId.trim());
    await ref.update({ studentIds: next });
    return res.json({ ok: true });
  },
);

app.patch("/instructor/projects/:id/students", requireFirebaseAuth, requireInstructorOrAdmin, async (req, res) => {
  const projectId = req.params.id;
  const { studentId, op } = (req.body ?? {}) as { studentId?: string; op?: "add" | "remove" };
  if (!projectId?.trim() || !studentId?.trim() || (op !== "add" && op !== "remove")) {
    return res.status(400).json({ error: "projectId, studentId, and op(add|remove) are required" });
  }

  const db = getFirestore();
  const ref = db.collection("projects").doc(projectId.trim());
  const snap = await ref.get();
  if (!snap.exists) return res.status(404).json({ error: "Project not found" });

  const courseId = (snap.get("courseId") as string | undefined) ?? "";
  if (!courseId.trim()) return res.status(400).json({ error: "Project missing courseId" });

  // Ensure instructor is assigned to the course (or admin).
  (req.params as any).id = courseId.trim();
  await new Promise<void>((resolve) =>
    requireInstructorAssignedToCourse(req, res, (err?: unknown) => {
      if (err) throw err;
      resolve();
    }),
  );
  if (res.headersSent) return;

  const studentIds = (snap.get("studentIds") as string[] | undefined) ?? [];
  const next =
    op === "add"
      ? Array.from(new Set([...studentIds, studentId.trim()]))
      : studentIds.filter((i) => i !== studentId.trim());
  await ref.update({ studentIds: next });
  return res.json({ ok: true });
});

// Serve built frontend from the same Cloud Run service (optional but recommended).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// When compiled, this file lives at backend/dist/index.js. The frontend build is copied to backend/public/.
const staticDir = path.resolve(__dirname, "../public");
app.use(express.static(staticDir));
app.get("*", (_req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

const port = Number(process.env.PORT ?? 8080);
app.listen(port, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://0.0.0.0:${port}`);
});

