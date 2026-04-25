import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  currentUserId: string | null;
  users: User[];
  courses: Course[];
  projects: Project[];
  updates: WeeklyUpdate[];

  login: (userId: string) => void;
  logout: () => void;

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

const palette = ["217 60% 22%", "188 70% 38%", "262 55% 45%", "152 55% 36%", "35 90% 48%", "0 70% 48%"];

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      currentUserId: null,
      users: seedUsers,
      courses: seedCourses,
      projects: seedProjects,
      updates: seedUpdates,

      login: (userId) => set({ currentUserId: userId }),
      logout: () => set({ currentUserId: null }),

      addUser: (u) =>
        set((s) => ({
          users: [
            ...s.users,
            { ...u, id: uid("u"), avatarColor: palette[s.users.length % palette.length] },
          ],
        })),
      updateUserRole: (id, role) =>
        set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, role } : u)) })),
      deleteUser: (id) => set((s) => ({ users: s.users.filter((u) => u.id !== id) })),

      addCourse: (c) => set((s) => ({ courses: [...s.courses, { ...c, id: uid("c") }] })),
      assignInstructor: (courseId, instructorId) =>
        set((s) => ({
          courses: s.courses.map((c) =>
            c.id === courseId && !c.instructorIds.includes(instructorId)
              ? { ...c, instructorIds: [...c.instructorIds, instructorId] }
              : c,
          ),
        })),
      removeInstructor: (courseId, instructorId) =>
        set((s) => ({
          courses: s.courses.map((c) =>
            c.id === courseId
              ? { ...c, instructorIds: c.instructorIds.filter((i) => i !== instructorId) }
              : c,
          ),
        })),

      addProject: (p) =>
        set((s) => ({ projects: [...s.projects, { ...p, id: uid("p"), progress: 0 }] })),
      assignStudentToProject: (projectId, studentId) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId && !p.studentIds.includes(studentId)
              ? { ...p, studentIds: [...p.studentIds, studentId] }
              : p,
          ),
        })),
      removeStudentFromProject: (projectId, studentId) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? { ...p, studentIds: p.studentIds.filter((i) => i !== studentId) }
              : p,
          ),
        })),

      submitUpdate: (u) =>
        set((s) => ({
          updates: [
            ...s.updates,
            {
              ...u,
              id: uid("w"),
              submittedAt: new Date().toISOString(),
              status: "pending",
              comments: [],
            },
          ],
          projects: s.projects.map((p) =>
            p.id === u.projectId ? { ...p, progress: u.progress } : p,
          ),
        })),
      editUpdateGoals: (updateId, thisWeekGoals, nextWeekGoals) =>
        set((s) => ({
          updates: s.updates.map((w) =>
            w.id === updateId ? { ...w, thisWeekGoals, nextWeekGoals } : w,
          ),
        })),
      setApproval: (updateId, status) =>
        set((s) => ({
          updates: s.updates.map((w) => (w.id === updateId ? { ...w, status } : w)),
        })),
      addComment: (updateId, authorId, text) =>
        set((s) => ({
          updates: s.updates.map((w) =>
            w.id === updateId
              ? {
                  ...w,
                  comments: [
                    ...w.comments,
                    { id: uid("c"), authorId, text, createdAt: new Date().toISOString() },
                  ],
                }
              : w,
          ),
        })),
      setProjectProgress: (projectId, progress) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === projectId ? { ...p, progress } : p)),
        })),
    }),
    { name: "track-studio-store-v1" },
  ),
);

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
