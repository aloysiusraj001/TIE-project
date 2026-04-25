import { useState } from "react";
import AppShell from "@/components/AppShell";
import { useApp } from "@/data/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/Avatar";
import { StatusBadge } from "@/components/StatusBadge";
import { WeeklyUpdateCard } from "@/components/WeeklyUpdateCard";
import { SubmitUpdateForm } from "@/components/SubmitUpdateForm";
import { LayoutDashboard, ChevronRight, ArrowLeft, Users as UsersIcon, Plus } from "lucide-react";
import { differenceInDays } from "date-fns";

const StudentDashboard = () => {
  const user = useApp((s) => s.users.find((u) => u.id === s.currentUserId))!;
  const allProjects = useApp((s) => s.projects);
  const courses = useApp((s) => s.courses);
  const updates = useApp((s) => s.updates);
  const users = useApp((s) => s.users);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);

  const nav = [{ to: "/student", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> }];
  const projects = allProjects.filter((p) => p.studentIds.includes(user.id));

  if (selectedProjectId) {
    const project = projects.find((p) => p.id === selectedProjectId)!;
    const course = courses.find((c) => c.id === project.courseId);
    const projectUpdates = updates
      .filter((u) => u.projectId === project.id)
      .sort((a, b) => b.weekNumber - a.weekNumber);
    const lastUpdate = projectUpdates[0];
    const daysSince = lastUpdate ? differenceInDays(new Date(), new Date(lastUpdate.submittedAt)) : null;

    return (
      <AppShell roleLabel="Student" nav={nav}>
        <div className="container mx-auto max-w-5xl px-6 py-8">
          <Button variant="ghost" size="sm" className="mb-4" onClick={() => { setSelectedProjectId(null); setComposing(false); }}>
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to my projects
          </Button>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary">{course?.code}</Badge>
            <span className="text-xs text-muted-foreground">{course?.name}</span>
          </div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">{project.name}</h1>
          <p className="mt-1 text-muted-foreground">{project.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex -space-x-2">
                {project.studentIds.map((sid) => <Avatar key={sid} userId={sid} size={28} />)}
              </div>
              <span className="text-sm text-muted-foreground">
                {project.studentIds.map((sid) => users.find((u) => u.id === sid)?.name).join(", ")}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">Progress</span>
              <div className="h-2 w-32 overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-gradient-hero" style={{ width: `${project.progress}%` }} />
              </div>
              <span className="font-serif font-semibold text-primary">{project.progress}%</span>
            </div>
          </div>

          {!composing && (
            <Card className="academic-card mt-6 flex items-center justify-between bg-gradient-hero p-5 text-primary-foreground">
              <div>
                <h3 className="font-serif text-lg font-semibold">Time for this week's update</h3>
                <p className="text-sm text-primary-foreground/80">
                  {lastUpdate
                    ? `Last update was ${daysSince} day${daysSince === 1 ? "" : "s"} ago.`
                    : "No updates yet — submit your first one."}
                </p>
              </div>
              <Button variant="secondary" onClick={() => setComposing(true)}>
                <Plus className="mr-1.5 h-4 w-4" /> Submit update
              </Button>
            </Card>
          )}

          {composing && (
            <div className="mt-6">
              <SubmitUpdateForm project={project} onSubmitted={() => setComposing(false)} />
            </div>
          )}

          <div className="mt-8">
            <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">
              Weekly history ({projectUpdates.length})
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Browse previous weeks to track continuity and see instructor feedback.
            </p>
            <div className="space-y-3">
              {projectUpdates.map((u, idx) => (
                <WeeklyUpdateCard key={u.id} update={u} viewer="student" defaultOpen={idx === 0} />
              ))}
              {projectUpdates.length === 0 && (
                <Card className="academic-card p-8 text-center text-sm text-muted-foreground">
                  No updates yet — submit your first one above.
                </Card>
              )}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell roleLabel="Student" nav={nav}>
      <div className="container mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold text-foreground">Hi {user.name.split(" ")[0]} 👋</h1>
          <p className="text-sm text-muted-foreground">
            You're on {projects.length} project team{projects.length === 1 ? "" : "s"}. Pick one to view or submit a weekly update.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => {
            const course = courses.find((c) => c.id === p.courseId);
            const lastUpdate = updates
              .filter((u) => u.projectId === p.id)
              .sort((a, b) => b.weekNumber - a.weekNumber)[0];
            return (
              <Card key={p.id} className="academic-card cursor-pointer p-5" onClick={() => setSelectedProjectId(p.id)}>
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-2">{course?.code}</Badge>
                    <h3 className="font-serif text-lg font-semibold text-foreground">{p.name}</h3>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {p.studentIds.map((sid) => <Avatar key={sid} userId={sid} size={24} />)}
                  </div>
                  <span className="text-xs text-muted-foreground">{p.studentIds.length} teammates</span>
                </div>
                <div className="mb-3">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-primary">{p.progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-gradient-hero" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
                {lastUpdate ? (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Latest: Week {lastUpdate.weekNumber}</span>
                    <StatusBadge status={lastUpdate.status} />
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">No updates yet — start your first one</span>
                )}
              </Card>
            );
          })}
          {projects.length === 0 && (
            <Card className="academic-card p-8 text-center text-sm text-muted-foreground md:col-span-2">
              You haven't been assigned to any projects yet. Reach out to your instructor.
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default StudentDashboard;
