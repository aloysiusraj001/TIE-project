import { useState } from "react";
import AppShell from "@/components/AppShell";
import { useApp } from "@/data/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/Avatar";
import { StatusBadge } from "@/components/StatusBadge";
import { WeeklyUpdateCard } from "@/components/WeeklyUpdateCard";
import { SegmentedTabs } from "@/components/SegmentedTabs";
import { LayoutDashboard, BookOpen, ChevronRight, ArrowLeft, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type InstructorTab = "projects" | "pending" | "courses";

const InstructorDashboard = () => {
  const user = useApp((s) => s.users.find((u) => u.id === s.currentUserId))!;
  const allCourses = useApp((s) => s.courses);
  const projects = useApp((s) => s.projects);
  const updates = useApp((s) => s.updates);
  const users = useApp((s) => s.users);
  const purchaseRequests = useApp((s) => s.purchaseRequests);
  const reviewPurchaseRequest = useApp((s) => s.reviewPurchaseRequest);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<InstructorTab>("projects");
  const [prNotes, setPrNotes] = useState<Record<string, string>>({});

  const courses = allCourses.filter((c) => c.instructorIds.includes(user.id));
  const myProjects = projects.filter((p) => courses.some((c) => c.id === p.courseId));
  const myUpdates = updates.filter((u) => myProjects.some((p) => p.id === u.projectId));
  const pendingUpdates = myUpdates.filter((u) => u.status === "pending");
  const pending = pendingUpdates.length;

  const nav = [{ to: "/instructor", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> }];

  if (selectedProjectId) {
    const project = projects.find((p) => p.id === selectedProjectId)!;
    const course = courses.find((c) => c.id === project.courseId);
    const projectUpdates = updates
      .filter((u) => u.projectId === project.id)
      .sort((a, b) => b.weekNumber - a.weekNumber);
    const progressNow = projectUpdates[0]?.progress ?? project.progress;
    const projectPRs = purchaseRequests
      .filter((r) => r.projectId === project.id)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    return (
      <AppShell roleLabel="Instructor" nav={nav}>
        <div className="container mx-auto max-w-5xl px-6 py-8">
          <Button variant="ghost" size="sm" className="mb-4" onClick={() => setSelectedProjectId(null)}>
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to overview
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
                <div className="h-full bg-gradient-hero" style={{ width: `${progressNow}%` }} />
              </div>
              <span className="font-serif font-semibold text-primary">{progressNow}%</span>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">Weekly updates ({projectUpdates.length})</h2>
            <div className="space-y-3">
              {projectUpdates.map((u, idx) => (
                <WeeklyUpdateCard key={u.id} update={u} viewer="instructor" defaultOpen={idx === 0} />
              ))}
              {projectUpdates.length === 0 && (
                <Card className="academic-card p-8 text-center text-sm text-muted-foreground">
                  No weekly updates submitted yet.
                </Card>
              )}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="mb-2 font-serif text-xl font-semibold text-foreground">
              Purchase requests ({projectPRs.length})
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Review project purchase requests. Approving/rejecting is separate from weekly updates.
            </p>

            <div className="space-y-3">
              {projectPRs.map((r) => {
                const requester = users.find((u) => u.id === r.requesterId);
                const prNote = prNotes[r.id] ?? "";
                return (
                  <Card key={r.id} className="academic-card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-foreground">{r.item}</span>
                          <span className="text-xs text-muted-foreground">×{r.quantity}</span>
                          <StatusBadge status={r.status} />
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          Requested by {requester?.name ?? "Unknown"} · Cost: {Number(r.cost).toFixed(2)}
                        </div>
                        {r.link ? (
                          <a className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline" href={r.link} target="_blank" rel="noreferrer">
                            View item link
                          </a>
                        ) : null}
                        <p className="mt-3 text-sm text-foreground">{r.justification}</p>
                        {r.reviewNote ? (
                          <p className="mt-3 text-sm text-muted-foreground">Review note: {r.reviewNote}</p>
                        ) : null}
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        {new Date(r.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="space-y-1.5 md:col-span-2">
                        <Label>Optional note to team</Label>
                        <Textarea
                          value={prNote}
                          onChange={(e) => setPrNotes((s) => ({ ...s, [r.id]: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="flex items-center gap-2 md:col-span-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            try {
                              reviewPurchaseRequest(r.id, "rejected", prNote);
                              setPrNotes((s) => ({ ...s, [r.id]: "" }));
                              toast.success("Request rejected.");
                            } catch {
                              toast.error("Could not update request.");
                            }
                          }}
                        >
                          Reject
                        </Button>
                        <Button
                          onClick={() => {
                            try {
                              reviewPurchaseRequest(r.id, "approved", prNote);
                              setPrNotes((s) => ({ ...s, [r.id]: "" }));
                              toast.success("Request approved.");
                            } catch {
                              toast.error("Could not update request.");
                            }
                          }}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}

              {projectPRs.length === 0 && (
                <Card className="academic-card p-8 text-center text-sm text-muted-foreground">
                  No purchase requests for this project yet.
                </Card>
              )}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell roleLabel="Instructor" nav={nav}>
      <div className="container mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold text-foreground">Welcome back, {user.name.split(" ")[1] ?? user.name}</h1>
          <p className="text-sm text-muted-foreground">
            {pending > 0 ? `${pending} weekly update${pending === 1 ? "" : "s"} awaiting your review.` : "All caught up — no pending reviews."}
          </p>
        </div>

        <SegmentedTabs<InstructorTab>
          value={activeTab}
          onChange={setActiveTab}
          tabs={[
            { value: "projects", label: <>My projects ({myProjects.length})</> },
            { value: "pending", label: <>Pending reviews ({pending})</> },
            { value: "courses", label: <>My courses ({courses.length})</> },
          ]}
        />

        {activeTab === "projects" && (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {myProjects.map((p) => {
              const course = courses.find((c) => c.id === p.courseId);
              const lastUpdate = updates
                .filter((u) => u.projectId === p.id)
                .sort((a, b) => b.weekNumber - a.weekNumber)[0];
              const progressNow = lastUpdate?.progress ?? p.progress;
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
                    <span className="text-xs text-muted-foreground">{p.studentIds.length} students</span>
                  </div>
                  <div className="mb-3">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-primary">{progressNow}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-gradient-hero" style={{ width: `${progressNow}%` }} />
                    </div>
                  </div>
                  {lastUpdate ? (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Latest: Week {lastUpdate.weekNumber}</span>
                      <StatusBadge status={lastUpdate.status} />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No updates yet</span>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === "pending" && (
          <div className="mt-5 space-y-3">
            {pendingUpdates.map((u) => {
              const project = projects.find((p) => p.id === u.projectId);
              return (
                <div key={u.id}>
                  <button onClick={() => setSelectedProjectId(u.projectId)} className="mb-2 text-sm font-medium text-primary hover:underline">
                    {project?.name} →
                  </button>
                  <WeeklyUpdateCard update={u} viewer="instructor" defaultOpen />
                </div>
              );
            })}
            {pendingUpdates.length === 0 && (
              <Card className="academic-card p-8 text-center text-sm text-muted-foreground">
                Nothing waiting on you. 🎉
              </Card>
            )}
          </div>
        )}

        {activeTab === "courses" && (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {courses.map((c) => {
              const cProjects = projects.filter((p) => p.courseId === c.id);
              return (
                <Card key={c.id} className="academic-card p-5">
                  <Badge variant="secondary" className="mb-2">{c.code}</Badge>
                  <h3 className="font-serif text-lg font-semibold text-foreground">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.term}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    {cProjects.length} project{cProjects.length === 1 ? "" : "s"}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default InstructorDashboard;
