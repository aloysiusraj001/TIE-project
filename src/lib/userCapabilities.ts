/**
 * Client-side mirror of `backend/src/staffCapabilities.ts`.
 *
 * Route and UI decisions should depend on **course/project membership**, not `role` alone:
 * - Course staff: id on `course.instructorIds`
 * - Project advisor: id on `project.assignedAdvisorIds`
 */
import type { Course, Project, User } from "@/data/types";

/** True if the user is listed as an instructor on any course. */
export function isUserCourseInstructor(userId: string, courses: Course[]): boolean {
  return courses.some((c) => (c.instructorIds ?? []).includes(userId));
}

/** Course staff for a specific course document (purchase approvals, etc.). */
export function isUserCourseStaffForCourse(userId: string, course: Course | undefined): boolean {
  if (!course) return false;
  return (course.instructorIds ?? []).includes(userId);
}

/** True if the user is assigned as a project-scoped advisor on any project. */
export function userHasProjectAdvisorAssignments(userId: string, projects: Project[]): boolean {
  return projects.some((p) => (p.assignedAdvisorIds ?? []).includes(userId));
}

/** Can open the instructor dashboard (course tools + union of projects). */
export function canAccessInstructorRoute(user: User | undefined, courses: Course[]): boolean {
  if (!user) return false;
  if (user.role === "instructor") return true;
  if (user.role === "advisor" && isUserCourseInstructor(user.id, courses)) return true;
  return false;
}

/** Can open the advisor dashboard (assigned projects only). */
export function canAccessAdvisorRoute(user: User | undefined, projects: Project[]): boolean {
  if (!user) return false;
  if (user.role === "advisor") return true;
  if (user.role === "instructor" && userHasProjectAdvisorAssignments(user.id, projects)) return true;
  return false;
}

/** Default home after sign-in (Index). */
export function getPostLoginPath(user: User | undefined, courses: Course[], projects: Project[]): string {
  if (!user) return "/login";
  if (user.role === "admin") return "/admin";
  if (user.role === "student") return "/student";
  if (user.role === "instructor") return "/instructor";
  if (user.role === "advisor") {
    return isUserCourseInstructor(user.id, courses) ? "/instructor" : "/advisor";
  }
  return "/student";
}

/** Advisor with no teaching assignments — restricted instructor UI (see dashboard). */
export function isAdvisorOnlyView(user: User | undefined, courses: Course[]): boolean {
  if (!user || user.role !== "advisor") return false;
  return !isUserCourseInstructor(user.id, courses);
}

/**
 * Second shell link to `/advisor` when the user’s default hub is `/instructor` but they also
 * have project-scoped advisor assignments.
 */
export function shouldShowAdvisorHubLink(user: User | undefined, courses: Course[], projects: Project[]): boolean {
  if (!user) return false;
  return canAccessInstructorRoute(user, courses) && userHasProjectAdvisorAssignments(user.id, projects);
}