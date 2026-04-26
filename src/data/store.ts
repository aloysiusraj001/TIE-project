import { create } from "zustand";
import { firebaseAuth, firestore } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  onSnapshot,
  setDoc,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { onAuthStateChanged, signOut as fbSignOut } from "firebase/auth";
import {
  ApprovalStatus,
  Comment,
  Course,
  Project,
  ResourceLink,
  Role,
  User,
  WeeklyGoal,
  WeeklyUpdate,
} from "./types";
import { seedCourses, seedProjects, seedUpdates, seedUsers } from "./seed";

const uid = (p = "id") => `${p}-${Math.random().toString(36).slice(2, 9)}`;

interface AppState {
  initialized: boolean;
  authReady: boolean;
  currentUserId: string | null;

  users: User[];
  courses: Course[];
  projects: Project[];
  updates: WeeklyUpdate[];

  init: () => void;
  signOut: () => Promise<void>;

  // admin
  addUser: (u: Omit<User, "id" | "avatarColor">) => void;
  updateUserRole: (id: string, role: Role) => void;
  deleteUser: (id: string) => void;
  addCourse: (c: Omit<Course, "id">) => void;
  assignInstructor: (courseId: string, instructorId: string) => void;
  removeInstructor: (courseId: string, instructorId: string) => void;
  addProject: (p: Omit<Project, "id" | "progress">) => void;
  assignStudentToProject: (projectId: string, studentId: string) => void;
  removeStudentFromProject: (projectId: string, studentId: string) => void;

  // updates
  submitUpdate: (u: Omit<WeeklyUpdate, "id" | "submittedAt" | "status" | "comments">) => void;
  editUpdateGoals: (
    updateId: string,
    thisWeekGoals: WeeklyGoal[],
    nextWeekGoals: WeeklyGoal[],
  ) => void;
  setApproval: (updateId: string, status: ApprovalStatus) => void;
  addComment: (updateId: string, authorId: string, text: string) => void;
  setProjectProgress: (projectId: string, progress: number) => void;
}

const palette = [
  "217 60% 22%",
  "188 70% 38%",
  "262 55% 45%",
  "152 55% 36%",
  "35 90% 48%",
  "0 70% 48%",
];

export const useApp = create<AppState>()((set, get) => {
  let unsubAuth: Unsubscribe | null = null;
  let unsubs: Unsubscribe[] = [];

  const ensureSeeded = async () => {
    const usersCol = collection(firestore, "users");
    const cnt = await getCountFromServer(usersCol);
    if (cnt.data().count > 0) return;

    await Promise.all(seedUsers.map((u) => setDoc(doc(firestore, "users", u.id), u, { merge: true })));
    await Promise.all(seedCourses.map((c) => setDoc(doc(firestore, "courses", c.id), c, { merge: true })));
    await Promise.all(seedProjects.map((p) => setDoc(doc(firestore, "projects", p.id), p, { merge: true })));
    await Promise.all(seedUpdates.map((w) => setDoc(doc(firestore, "updates", w.id), w, { merge: true })));
  };

  const startListeners = () => {
    unsubs.forEach((u) => u());
    unsubs = [];

    unsubs.push(
      onSnapshot(collection(firestore, "users"), (snap) => {
        const users = snap.docs.map((d) => d.data() as User);
        set({ users });
        const email = firebaseAuth.currentUser?.email;
        if (email) {
          const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
          if (u?.id !== get().currentUserId) set({ currentUserId: u?.id ?? null });
        }
      }),
    );
    unsubs.push(
      onSnapshot(collection(firestore, "courses"), (snap) => {
        set({ courses: snap.docs.map((d) => d.data() as Course) });
      }),
    );
    unsubs.push(
      onSnapshot(collection(firestore, "projects"), (snap) => {
        set({ projects: snap.docs.map((d) => d.data() as Project) });
      }),
    );
    unsubs.push(
      onSnapshot(collection(firestore, "updates"), (snap) => {
        set({ updates: snap.docs.map((d) => d.data() as WeeklyUpdate) });
      }),
    );
  };

  return {
    initialized: false,
    authReady: false,
    currentUserId: null,

    users: [],
    courses: [],
    projects: [],
    updates: [],

    init: () => {
      if (get().initialized) return;
      set({ initialized: true });

      unsubAuth?.();
      unsubAuth = onAuthStateChanged(firebaseAuth, (fbUser) => {
        set({ authReady: true });
        if (!fbUser?.email) {
          unsubs.forEach((u) => u());
          unsubs = [];
          set({ currentUserId: null });
          return;
        }

        void ensureSeeded()
          .catch(() => {
            // If rules disallow seeding from the client, continue without it.
          })
          .finally(() => {
            startListeners();
          });

        const u = get().users.find((x) => x.email.toLowerCase() === fbUser.email!.toLowerCase());
        set({ currentUserId: u?.id ?? null });
      });
    },

    signOut: async () => {
      await fbSignOut(firebaseAuth);
      set({ currentUserId: null });
    },

    // admin
    addUser: (u) => {
      const id = uid("u");
      const avatarColor = palette[get().users.length % palette.length];
      void setDoc(doc(firestore, "users", id), { ...u, id, avatarColor } satisfies User);
    },
    updateUserRole: (id, role) => {
      void updateDoc(doc(firestore, "users", id), { role });
    },
    deleteUser: (id) => {
      void deleteDoc(doc(firestore, "users", id));
    },

    addCourse: (c) => {
      const id = uid("c");
      void setDoc(doc(firestore, "courses", id), { ...c, id } satisfies Course);
    },
    assignInstructor: (courseId, instructorId) => {
      const course = get().courses.find((c) => c.id === courseId);
      if (!course || course.instructorIds.includes(instructorId)) return;
      void updateDoc(doc(firestore, "courses", courseId), {
        instructorIds: [...course.instructorIds, instructorId],
      });
    },
    removeInstructor: (courseId, instructorId) => {
      const course = get().courses.find((c) => c.id === courseId);
      if (!course) return;
      void updateDoc(doc(firestore, "courses", courseId), {
        instructorIds: course.instructorIds.filter((i) => i !== instructorId),
      });
    },

    addProject: (p) => {
      const id = uid("p");
      void setDoc(doc(firestore, "projects", id), { ...p, id, progress: 0 } satisfies Project);
    },
    assignStudentToProject: (projectId, studentId) => {
      const project = get().projects.find((p) => p.id === projectId);
      if (!project || project.studentIds.includes(studentId)) return;
      void updateDoc(doc(firestore, "projects", projectId), {
        studentIds: [...project.studentIds, studentId],
      });
    },
    removeStudentFromProject: (projectId, studentId) => {
      const project = get().projects.find((p) => p.id === projectId);
      if (!project) return;
      void updateDoc(doc(firestore, "projects", projectId), {
        studentIds: project.studentIds.filter((i) => i !== studentId),
      });
    },

    // updates
    submitUpdate: (u) => {
      const id = uid("w");
      const payload: WeeklyUpdate = {
        ...u,
        id,
        submittedAt: new Date().toISOString(),
        status: "pending",
        comments: [],
      };
      void setDoc(doc(firestore, "updates", id), payload);
      void updateDoc(doc(firestore, "projects", u.projectId), { progress: u.progress });
    },
    editUpdateGoals: (updateId, thisWeekGoals, nextWeekGoals) => {
      void updateDoc(doc(firestore, "updates", updateId), { thisWeekGoals, nextWeekGoals });
    },
    setApproval: (updateId, status) => {
      void updateDoc(doc(firestore, "updates", updateId), { status });
    },
    addComment: (updateId, authorId, text) => {
      const update = get().updates.find((u) => u.id === updateId);
      if (!update) return;
      const comments: Comment[] = [
        ...update.comments,
        { id: uid("c"), authorId, text, createdAt: new Date().toISOString() },
      ];
      void updateDoc(doc(firestore, "updates", updateId), { comments });
    },
    setProjectProgress: (projectId, progress) => {
      void updateDoc(doc(firestore, "projects", projectId), { progress });
    },
  };
});

export const newGoal = (text = "", achieved: boolean | null = null): WeeklyGoal => ({
  id: uid("g"),
  text,
  achieved,
});

export const newLink = (label = "", url = ""): ResourceLink => ({
  id: uid("l"),
  label,
  url,
});

export type { Comment };
