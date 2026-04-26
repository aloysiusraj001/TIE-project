import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { firebaseAuth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    try {
      setBusy(true);
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      // Role-based redirect happens via <Protected /> once Firestore user loads.
      navigate("/");
    } catch {
      setError("Sign-in failed. Check your email/password in Firebase Auth.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-12 lg:py-20">
        <div className="mx-auto max-w-xl">
          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg shadow-elegant">
              <img src="/favicon.svg" alt="Project Tracking" className="h-11 w-11" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Project Tracking</h1>
              <p className="text-sm text-muted-foreground">Student project tracking</p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="mb-2 text-4xl font-semibold leading-tight text-foreground lg:text-5xl">
              Sign in to continue
            </h2>
          </div>

          <Card className="academic-card p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  ref={emailRef}
                  type="email"
                  autoComplete="email"
                  placeholder="you@uni.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void handleSignIn();
                  }}
                />
              </div>

              {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}

              <Button
                className="w-full"
                onClick={() => void handleSignIn()}
                disabled={busy || !email.trim() || !password}
              >
                {busy ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
