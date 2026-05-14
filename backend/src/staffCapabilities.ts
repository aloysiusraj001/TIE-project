/**
 * Staff access model (keep in sync with frontend `src/lib/userCapabilities.ts`):
 *
 * - **Course staff**: user id appears on `courses[].instructorIds` for the project's course.
 *   Both `role=instructor` and `role=advisor` can be course staff; advisors may also be
 *   project-scoped only (`assignedAdvisorIds`).
 * - **Project advisor**: user id on `projects[].assignedAdvisorIds` (instructors may appear here too).
 * - **Instructor HTTP surface** (`requireInstructorOrAdmin`): admin, any `instructor`, or an
 *   `advisor` who teaches at least one course (Firestore `instructorIds` array-contains).
 *
 * Prefer **capability checks** (lists on course/project documents) over raw `role` alone.
 */

import type { DocumentSnapshot, Firestore } from "firebase-admin/firestore";

export type StaffUser = { id?: string; role?: string };

export function readInstructorIds(courseSnap: DocumentSnapshot | null | undefined): string[] {
  if (!courseSnap?.exists) return [];
  return ((courseSnap.get("instructorIds") as string[] | undefined) ?? []).filter(Boolean);
}

export function readAssignedAdvisorIds(projSnap: DocumentSnapshot | null | undefined): string[] {
  if (!projSnap?.exists) return [];
  return ((projSnap.get("assignedAdvisorIds") as string[] | undefined) ?? []).filter(Boolean);
}

/** True if this user may call instructor-scoped HTTP routes (admin / instructor / teaching advisor). */
export async function userMayCallInstructorEndpoints(db: Firestore, u: StaffUser): Promise<boolean> {
  if (!u?.role) return false;
  if (u.role === "admin" || u.role === "instructor") return true;
  if (u.role === "advisor" && u.id) {
    const teaches = await db.collection("courses").where("instructorIds", "array-contains", u.id).limit(1).get();
    return !teaches.empty;
  }
  return false;
}

/**
 * Weekly-update moderation (reviewer edit / status): course staff, or advisor/instructor
 * explicitly assigned on the project.
 */
export function staffMayModerateWeeklyUpdate(
  u: StaffUser,
  courseInstructorIds: string[],
  assignedAdvisorIds: string[],
): { ok: true } | { ok: false; error: string } {
  if (u.role === "admin") return { ok: true };
  if (!u.id) return { ok: false, error: "Missing user profile" };
  if (courseInstructorIds.includes(u.id)) return { ok: true };
  if (
    (u.role === "advisor" || u.role === "instructor") &&
    assignedAdvisorIds.includes(u.id)
  ) {
    return { ok: true };
  }
  return { ok: false, error: "Not allowed to moderate updates for this project" };
}

/**
 * Purchase request approval: **course instructors only** (list on the course), plus admin.
 * Matches “instructor-only purchase” while still allowing `role=advisor` who teach the course.
 */
export function staffMayReviewPurchaseRequest(
  u: StaffUser,
  courseInstructorIds: string[],
): { ok: true } | { ok: false; error: string } {
  if (u.role === "admin") return { ok: true };
  if (!u.id) return { ok: false, error: "Missing user profile" };
  if (courseInstructorIds.includes(u.id)) return { ok: true };
  return { ok: false, error: "Only course instructors may review purchase requests" };
}

/** Project read/write gates used by meetings and other project routes. */
export function userMayAccessProjectByMembership(
  userId: string,
  role: string,
  studentIds: string[],
  courseInstructorIds: string[],
  assignedAdvisorIds: string[],
): boolean {
  if (role === "admin") return true;
  if (studentIds.includes(userId)) return true;
  if (courseInstructorIds.includes(userId)) return true;
  if ((role === "advisor" || role === "instructor") && assignedAdvisorIds.includes(userId)) return true;
  return false;
}

/** Comments on weekly updates: roster + course staff + anyone listed as project advisor. */
export function userMayCommentOnWeeklyUpdate(
  u: StaffUser,
  studentIds: string[],
  courseInstructorIds: string[],
  assignedAdvisorIds: string[],
): boolean {
  if (u.role === "admin") return true;
  if (!u.id) return false;
  return (
    studentIds.includes(u.id) ||
    courseInstructorIds.includes(u.id) ||
    assignedAdvisorIds.includes(u.id)
  );
}
