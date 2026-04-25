import { useApp } from "@/data/store";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, ShieldCheck, BookOpen, Users } from "lucide-react";

const roleMeta = {
  admin: { label: "Administrator", icon: ShieldCheck, blurb: "Full access — manage users, courses, and projects." },
  instructor: { label: "Instructor", icon: BookOpen, blurb: "Review weekly updates, edit goals, approve work." },
  student: { label: "Student", icon: Users, blurb: "Submit weekly updates for your team projects." },
} as const;

const Login = () => {
  const users = useApp((s) => s.users);
  const login = useApp((s) => s.login);
  const navigate = useNavigate();

  const grouped = {
    admin: users.filter((u) => u.role === "admin"),
    instructor: users.filter((u) => u.role === "instructor"),
    student: users.filter((u) => u.role === "student"),
  };

  const handle = (id: string, role: string) => {
    login(id);
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-12 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-hero text-primary-foreground shadow-elegant">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Track Studio</h1>
              <p className="text-sm text-muted-foreground">Student project tracking — Spring 2026</p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="mb-2 text-4xl font-semibold leading-tight text-foreground lg:text-5xl">
              Sign in to continue
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              This is a demo environment. Pick any account below to enter the matching dashboard. Three
              role-based pathways — admin, instructor, and student — each with their own permissions.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {(Object.keys(grouped) as Array<keyof typeof grouped>).map((role) => {
              const Meta = roleMeta[role];
              const Icon = Meta.icon;
              return (
                <Card key={role} className="academic-card flex flex-col p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{Meta.label}</h3>
                    </div>
                  </div>
                  <p className="mb-5 text-sm text-muted-foreground">{Meta.blurb}</p>
                  <div className="flex flex-1 flex-col gap-2">
                    {grouped[role].map((u) => (
                      <Button
                        key={u.id}
                        variant="outline"
                        className="h-auto justify-start gap-3 border-border py-3 text-left hover:border-primary hover:bg-secondary"
                        onClick={() => handle(u.id, role)}
                      >
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-primary-foreground"
                          style={{ backgroundColor: `hsl(${u.avatarColor})` }}
                        >
                          {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </span>
                        <span className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">{u.name}</span>
                          <span className="text-xs text-muted-foreground">{u.email}</span>
                        </span>
                      </Button>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
