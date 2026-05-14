import { describe, expect, it } from "vitest";
import type { Course, Project, User } from "@/data/types";
import {
  canAccessAdvisorRoute,
  canAccessInstructorRoute,
  getPostLoginPath,
  isAdvisorOnlyView,
  isUserCourseStaffForCourse,
  shouldShowAdvisorHubLink,
} from "./userCapabilities";

const course = (over: Partial<Course>): Course =>
  ({
    id: "c1",
    code: "TIE1000",
    name: "Test",
    term: "Fall",
    studentIds: [],
    instructorIds: ["ins1"],
    ...over,
  }) as Course;

const project = (over: Partial<Project>): Project =>
  ({
    id: "p1",
    name: "P",
    description: "",
    courseId: "c1",
    studentIds: [],
    progress: 0,
    ...over,
  }) as Project;

const user = (over: Partial<User>): User =>
  ({
    id: "u1",
    name: "Test User",
    email: "u@test",
    role: "student",
    avatarColor: "0 0% 50%",
    ...over,
  }) as User;

describe("canAccessInstructorRoute", () => {
  it("allows instructors regardless of course lists", () => {
    const u = user({ id: "x", role: "instructor" });
    expect(canAccessInstructorRoute(u, [])).toBe(true);
  });

  it("allows advisors listed on a course", () => {
    const u = user({ id: "a1", role: "advisor" });
    const courses = [course({ instructorIds: ["a1"] })];
    expect(canAccessInstructorRoute(u, courses)).toBe(true);
  });

  it("denies advisors with no teaching assignment", () => {
    const u = user({ id: "a1", role: "advisor" });
    expect(canAccessInstructorRoute(u, [course({ instructorIds: ["ins1"] })])).toBe(false);
  });
});

describe("canAccessAdvisorRoute", () => {
  it("allows any advisor user", () => {
    expect(canAccessAdvisorRoute(user({ role: "advisor" }), [])).toBe(true);
  });

  it("allows instructors with project advisor assignments", () => {
    const u = user({ id: "i1", role: "instructor" });
    const projects = [project({ assignedAdvisorIds: ["i1"] })];
    expect(canAccessAdvisorRoute(u, projects)).toBe(true);
  });

  it("denies instructors without advisor assignments", () => {
    const u = user({ id: "i1", role: "instructor" });
    expect(canAccessAdvisorRoute(u, [project({ assignedAdvisorIds: ["a1"] })])).toBe(false);
  });
});

describe("getPostLoginPath", () => {
  it("sends teaching advisors to instructor hub", () => {
    const u = user({ id: "a1", role: "advisor" });
    const courses = [course({ instructorIds: ["a1"] })];
    expect(getPostLoginPath(u, courses, [])).toBe("/instructor");
  });

  it("sends advisor-only users to advisor hub", () => {
    const u = user({ id: "a1", role: "advisor" });
    expect(getPostLoginPath(u, [course({ instructorIds: ["ins1"] })], [])).toBe("/advisor");
  });
});

describe("isAdvisorOnlyView", () => {
  it("is true for advisors not on any course instructor list", () => {
    const u = user({ role: "advisor", id: "a1" });
    expect(isAdvisorOnlyView(u, [course({ instructorIds: ["ins1"] })])).toBe(true);
  });

  it("is false for teaching advisors", () => {
    const u = user({ role: "advisor", id: "a1" });
    expect(isAdvisorOnlyView(u, [course({ instructorIds: ["a1"] })])).toBe(false);
  });
});

describe("shouldShowAdvisorHubLink", () => {
  it("is true when user uses instructor hub and has advisor project assignments", () => {
    const u = user({ id: "i1", role: "instructor" });
    const courses: Course[] = [];
    const projects = [project({ assignedAdvisorIds: ["i1"] })];
    expect(shouldShowAdvisorHubLink(u, courses, projects)).toBe(true);
  });

  it("is false without instructor-route access", () => {
    const u = user({ id: "a1", role: "advisor" });
    const courses = [course({ instructorIds: ["ins1"] })];
    const projects = [project({ assignedAdvisorIds: ["a1"] })];
    expect(shouldShowAdvisorHubLink(u, courses, projects)).toBe(false);
  });
});

describe("isUserCourseStaffForCourse", () => {
  it("reflects course instructorIds membership", () => {
    const c = course({ instructorIds: ["u1", "u2"] });
    expect(isUserCourseStaffForCourse("u1", c)).toBe(true);
    expect(isUserCourseStaffForCourse("nope", c)).toBe(false);
    expect(isUserCourseStaffForCourse("u1", undefined)).toBe(false);
  });
});
