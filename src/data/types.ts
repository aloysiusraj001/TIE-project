export type Role = "admin" | "instructor" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarColor: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  term: string;
  instructorIds: string[];
}

export interface Project {
  id: string;
  courseId: string;
  name: string;
  description: string;
  studentIds: string[];
  progress: number; // 0-100
}

export type ApprovalStatus = "pending" | "approved" | "needs_revision";

export interface WeeklyGoal {
  id: string;
  text: string;
  achieved: boolean | null; // null for next-week goals
  reason?: string;
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface ResourceLink {
  id: string;
  label: string;
  url: string;
}

export interface WeeklyUpdate {
  id: string;
  projectId: string;
  weekNumber: number;
  weekStart: string; // ISO
  authorId: string;
  thisWeekGoals: WeeklyGoal[];
  nextWeekGoals: WeeklyGoal[];
  blockers: string;
  progress: number;
  links: ResourceLink[];
  status: ApprovalStatus;
  comments: Comment[];
  submittedAt: string;
}
