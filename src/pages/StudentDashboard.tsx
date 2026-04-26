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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

const StudentDashboard = () => {
  const user = useApp((s) => s.users.find((u) => u.id === s.currentUserId))!;
  const allProjects = useApp((s) => s.projects);
  const courses = useApp((s) => s.courses);
  const updates = useApp((s) => s.updates);
  const users = useApp((s) => s.users);
  const purchaseRequests = useApp((s) => s.purchaseRequests);
  const submitPurchaseRequest = useApp((s) => s.submitPurchaseRequest);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);
  const [prItem, setPrItem] = useState("");
  const [prQty, setPrQty] = useState(1);
  const [prCost, setPrCost] = useState(0);
  const [prLink, setPrLink] = useState("");
  const [prWhy, setPrWhy] = useState("");
  const money = new Intl.NumberFormat("en-HK", { style: "currency", currency: "HKD" });

  const nav = [{ to: "/student", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> }];
  const projects = allProjects.filter((p) => p.studentIds.includes(user.id));

  if (selectedProjectId) {
    const project = projects.find((p) => p.id === selectedProjectId)!;
    const course = courses.find((c) => c.id === project.courseId);
    const projectUpdates = updates
      .filter((u) => u.projectId === project.id)
      .sort((a, b) => b.weekNumber - a.weekNumber);
    const lastUpdate = projectUpdates[0];
    const progressNow = lastUpdate?.progress ?? project.progress;
    const projectPRs = purchaseRequests
      .filter((r) => r.projectId === project.id)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
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
                <div className="h-full bg-gradient-hero" style={{ width: `${progressNow}%` }} />
              </div>
              <span className="font-serif font-semibold text-primary">{progressNow}%</span>
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

          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl font-semibold text-foreground">Purchase requests</h2>
                <p className="text-sm text-muted-foreground">
                  Request items for this project. Your instructor will review and approve/reject.
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-1.5 h-4 w-4" /> New request
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request a purchase</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label>Item</Label>
                      <Input value={prItem} onChange={(e) => setPrItem(e.target.value)} placeholder="e.g. Arduino Uno" />
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min={1}
                          value={prQty}
                          onChange={(e) => setPrQty(Math.max(1, Number(e.target.value || 1)))}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Cost (total, HKD)</Label>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={prCost}
                          onChange={(e) => setPrCost(Math.max(0, Number(e.target.value || 0)))}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Link</Label>
                      <Input value={prLink} onChange={(e) => setPrLink(e.target.value)} placeholder="https://…" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Why it’s needed</Label>
                      <Textarea value={prWhy} onChange={(e) => setPrWhy(e.target.value)} rows={4} />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      onClick={() => {
                        if (!prItem.trim() || !prWhy.trim()) {
                          toast.error("Item and justification are required.");
                          return;
                        }
                        submitPurchaseRequest({
                          projectId: project.id,
                          requesterId: user.id,
                          item: prItem.trim(),
                          quantity: prQty,
                          cost: prCost,
                          link: prLink.trim(),
                          justification: prWhy.trim(),
                        });
                        setPrItem("");
                        setPrQty(1);
                        setPrCost(0);
                        setPrLink("");
                        setPrWhy("");
                        toast.success("Purchase request submitted.");
                      }}
                    >
                      Submit request
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {projectPRs.map((r) => (
                <Card key={r.id} className="academic-card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-foreground">{r.item}</span>
                        <span className="text-xs text-muted-foreground">×{r.quantity}</span>
                        <StatusBadge status={r.status} />
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Cost: {money.format(Number(r.cost) || 0)}
                      </div>
                      {r.link ? (
                        <a className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline" href={r.link} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4" /> View item link
                        </a>
                      ) : null}
                      <p className="mt-3 text-sm text-foreground">{r.justification}</p>
                      {r.reviewNote ? (
                        <p className="mt-3 text-sm text-muted-foreground">
                          Instructor note: {r.reviewNote}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleString()}
                    </div>
                  </div>
                </Card>
              ))}

              {projectPRs.length === 0 && (
                <Card className="academic-card p-8 text-center text-sm text-muted-foreground">
                  No purchase requests yet.
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
                  <span className="text-xs text-muted-foreground">{p.studentIds.length} teammates</span>
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
