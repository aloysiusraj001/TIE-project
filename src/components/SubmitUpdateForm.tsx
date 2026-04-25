import { useState } from "react";
import { useApp, newGoal, newLink } from "@/data/store";
import { Project, WeeklyGoal, ResourceLink } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Send } from "lucide-react";
import { toast } from "sonner";

export const SubmitUpdateForm = ({ project, onSubmitted }: { project: Project; onSubmitted?: () => void }) => {
  const submitUpdate = useApp((s) => s.submitUpdate);
  const currentUserId = useApp((s) => s.currentUserId)!;
  const updates = useApp((s) => s.updates);

  const lastWeek = Math.max(0, ...updates.filter((u) => u.projectId === project.id).map((u) => u.weekNumber));

  const [thisWeek, setThisWeek] = useState<WeeklyGoal[]>([newGoal("", false), newGoal("", false)]);
  const [nextWeek, setNextWeek] = useState<WeeklyGoal[]>([newGoal("")]);
  const [blockers, setBlockers] = useState("");
  const [progress, setProgress] = useState(project.progress);
  const [links, setLinks] = useState<ResourceLink[]>([]);

  const handleSubmit = () => {
    if (thisWeek.every((g) => !g.text.trim())) {
      toast.error("Please add at least one goal for this week.");
      return;
    }
    submitUpdate({
      projectId: project.id,
      weekNumber: lastWeek + 1,
      weekStart: new Date().toISOString(),
      authorId: currentUserId,
      thisWeekGoals: thisWeek.filter((g) => g.text.trim()),
      nextWeekGoals: nextWeek.filter((g) => g.text.trim()),
      blockers,
      progress,
      links: links.filter((l) => l.label.trim() && l.url.trim()),
    });
    toast.success("Weekly update submitted for review.");
    onSubmitted?.();
  };

  return (
    <Card className="academic-card space-y-6 p-6">
      <div>
        <h3 className="font-serif text-xl font-semibold text-foreground">New weekly update — Week {lastWeek + 1}</h3>
        <p className="text-sm text-muted-foreground">
          Reflect on this week's goals, plan next week, and submit for instructor review.
        </p>
      </div>

      <section>
        <Label className="mb-3 block text-sm font-semibold text-foreground">
          Goals for this week — were they achieved?
        </Label>
        <div className="space-y-3">
          {thisWeek.map((g, idx) => (
            <div key={g.id} className="rounded-md border border-border bg-gradient-subtle p-3">
              <div className="flex gap-2">
                <Textarea
                  value={g.text}
                  onChange={(e) => {
                    const next = [...thisWeek];
                    next[idx] = { ...g, text: e.target.value };
                    setThisWeek(next);
                  }}
                  placeholder="e.g. Finalize database schema"
                  rows={2}
                  className="text-sm"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setThisWeek(thisWeek.filter((_, i) => i !== idx))}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={!!g.achieved}
                    onCheckedChange={(v) => {
                      const next = [...thisWeek];
                      next[idx] = { ...g, achieved: !!v, reason: v ? undefined : g.reason };
                      setThisWeek(next);
                    }}
                  />
                  Achieved
                </label>
                {!g.achieved && (
                  <Input
                    placeholder="If not achieved, what was the reason?"
                    value={g.reason ?? ""}
                    onChange={(e) => {
                      const next = [...thisWeek];
                      next[idx] = { ...g, reason: e.target.value };
                      setThisWeek(next);
                    }}
                    className="h-9 flex-1 text-sm"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="mt-3"
          onClick={() => setThisWeek([...thisWeek, newGoal("", false)])}
        >
          <Plus className="mr-1 h-4 w-4" /> Add goal
        </Button>
      </section>

      <section>
        <Label className="mb-3 block text-sm font-semibold text-foreground">Goals for next week</Label>
        <div className="space-y-3">
          {nextWeek.map((g, idx) => (
            <div key={g.id} className="flex gap-2">
              <Textarea
                value={g.text}
                onChange={(e) => {
                  const next = [...nextWeek];
                  next[idx] = { ...g, text: e.target.value };
                  setNextWeek(next);
                }}
                placeholder="e.g. Begin user testing with 5 participants"
                rows={2}
                className="text-sm"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setNextWeek(nextWeek.filter((_, i) => i !== idx))}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="mt-3"
          onClick={() => setNextWeek([...nextWeek, newGoal("")])}
        >
          <Plus className="mr-1 h-4 w-4" /> Add goal
        </Button>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div>
          <Label className="mb-2 block text-sm font-semibold text-foreground">Blockers</Label>
          <Textarea
            value={blockers}
            onChange={(e) => setBlockers(e.target.value)}
            placeholder="Anything getting in your team's way?"
            rows={4}
            className="text-sm"
          />
        </div>
        <div>
          <Label className="mb-2 block text-sm font-semibold text-foreground">
            Overall project progress: <span className="text-primary">{progress}%</span>
          </Label>
          <Slider
            value={[progress]}
            onValueChange={(v) => setProgress(v[0])}
            min={0}
            max={100}
            step={1}
            className="mt-4"
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
        </div>
      </section>

      <section>
        <Label className="mb-2 block text-sm font-semibold text-foreground">External documents & links</Label>
        <p className="mb-3 text-xs text-muted-foreground">
          Attach Figma files, GitHub PRs, Google Docs, research notes, etc.
        </p>
        <div className="space-y-2">
          {links.map((l, idx) => (
            <div key={l.id} className="flex gap-2">
              <Input
                placeholder="Label (e.g. Figma — wireframes)"
                value={l.label}
                onChange={(e) => {
                  const next = [...links];
                  next[idx] = { ...l, label: e.target.value };
                  setLinks(next);
                }}
                className="text-sm"
              />
              <Input
                placeholder="https://…"
                value={l.url}
                onChange={(e) => {
                  const next = [...links];
                  next[idx] = { ...l, url: e.target.value };
                  setLinks(next);
                }}
                className="flex-1 text-sm"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setLinks(links.filter((_, i) => i !== idx))}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
        <Button size="sm" variant="outline" className="mt-3" onClick={() => setLinks([...links, newLink()])}>
          <Plus className="mr-1 h-4 w-4" /> Add link
        </Button>
      </section>

      <div className="flex justify-end border-t border-border pt-4">
        <Button onClick={handleSubmit} className="bg-primary hover:bg-primary-glow">
          <Send className="mr-2 h-4 w-4" /> Submit update for review
        </Button>
      </div>
    </Card>
  );
};
