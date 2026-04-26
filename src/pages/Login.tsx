import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { firebaseAuth } from "@/lib/firebase";
import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
} from "firebase/auth";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  const backendUrlRaw = (import.meta.env.VITE_BACKEND_URL as string | undefined)?.trim() || "";
  const backendUrl = backendUrlRaw === "." || backendUrlRaw === "/" ? window.location.origin : backendUrlRaw;

  const ensureUserRow = async () => {
    const fbUser = firebaseAuth.currentUser;
    if (!fbUser || !backendUrl) return;
    const token = await fbUser.getIdToken();
    await fetch(`${backendUrl.replace(/\/$/, "")}/users/ensure`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  };

  useEffect(() => {
    // Complete magic-link sign-in if this page is opened from an email link.
    if (!isSignInWithEmailLink(firebaseAuth, window.location.href)) return;

    const storedEmail = window.localStorage.getItem("magicLinkEmail") ?? "";
    const effectiveEmail = (email || storedEmail).trim();
    if (!effectiveEmail) {
      setError("Enter the email you used for the magic link, then try again.");
      return;
    }

    (async () => {
      setBusy(true);
      setError(null);
      try {
        await signInWithEmailLink(firebaseAuth, effectiveEmail, window.location.href);
        window.localStorage.removeItem("magicLinkEmail");
        await ensureUserRow();
        navigate("/");
      } catch {
        setError("Magic link sign-in failed. Try requesting a new link.");
      } finally {
        setBusy(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignIn = async () => {
    setError(null);
    try {
      setBusy(true);
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      await ensureUserRow();
      // Role-based redirect happens via <Protected /> once Firestore user loads.
      navigate("/");
    } catch {
      setError("Sign-in failed. Check your email/password in Firebase Auth.");
    } finally {
      setBusy(false);
    }
  };

  const handleMagicLink = async () => {
    setError(null);
    const e = email.trim();
    if (!e) {
      setError("Enter your email first.");
      return;
    }
    try {
      setBusy(true);
      const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(firebaseAuth, e, actionCodeSettings);
      window.localStorage.setItem("magicLinkEmail", e);
      setMagicSent(true);
      toast.success("Magic link sent. Check your email.");
    } catch {
      setError("Could not send magic link. Check Firebase Auth settings for Email Link sign-in.");
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
              {magicSent ? (
                <p className="text-sm text-muted-foreground">
                  We emailed you a sign-in link. Open it on the same device/browser.
                </p>
              ) : null}

              <Button
                className="w-full"
                onClick={() => void handleSignIn()}
                disabled={busy || !email.trim() || !password}
              >
                {busy ? "Signing in..." : "Sign in"}
              </Button>

              <Button
                className="w-full"
                variant="outline"
                onClick={() => void handleMagicLink()}
                disabled={busy || !email.trim()}
              >
                {busy ? "Sending..." : "Email me a magic link (student sign up)"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
