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
  const [fullName, setFullName] = useState("");
  const [hkustEmail, setHkustEmail] = useState("");
  const [programme, setProgramme] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [magicLinkDetected, setMagicLinkDetected] = useState(false);

  const backendUrlRaw = (import.meta.env.VITE_BACKEND_URL as string | undefined)?.trim() || "";
  const backendUrl = backendUrlRaw === "." || backendUrlRaw === "/" ? window.location.origin : backendUrlRaw;

  const ensureUserRow = async () => {
    const fbUser = firebaseAuth.currentUser;
    if (!fbUser || !backendUrl) return;
    const token = await fbUser.getIdToken();
    await fetch(`${backendUrl.replace(/\/$/, "")}/users/ensure`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: fullName.trim(),
        hkustEmail: hkustEmail.trim(),
        programme: programme.trim(),
      }),
    });
  };

  const completeMagicLink = async () => {
    const storedEmail = window.localStorage.getItem("magicLinkEmail") ?? "";
    const effectiveEmail = (email || storedEmail).trim();
    if (!effectiveEmail) {
      setError("Enter the email you used for the magic link.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await signInWithEmailLink(firebaseAuth, effectiveEmail, window.location.href);
      window.localStorage.removeItem("magicLinkEmail");
      await ensureUserRow();
      navigate("/");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Magic link sign-in failed.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    // If this page is opened from a magic-link, we may need the user to type their email
    // (e.g. link opened on a different device/browser with no localStorage state).
    if (!isSignInWithEmailLink(firebaseAuth, window.location.href)) return;
    setMagicLinkDetected(true);

    // Best-effort auto-complete when email is available from localStorage.
    const storedEmail = window.localStorage.getItem("magicLinkEmail") ?? "";
    if (storedEmail && !email) setEmail(storedEmail);
    if (storedEmail) void completeMagicLink();
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
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not send magic link.";
      setError(`${msg} Check Firebase Auth settings for Email Link sign-in.`);
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

              <div className="rounded-md border border-border bg-gradient-subtle p-4">
                <div className="mb-2 text-sm font-semibold text-foreground">First time here?</div>
                <p className="mb-3 text-xs text-muted-foreground">
                  If you’re signing up with a magic link, please fill in your profile details.
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                      Full name (Surname, First name)
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="CHAN, Tai Man"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hkustEmail" className="text-sm font-medium text-foreground">
                      HKUST email (optional)
                    </Label>
                    <Input
                      id="hkustEmail"
                      type="email"
                      placeholder="name@connect.ust.hk"
                      value={hkustEmail}
                      onChange={(e) => setHkustEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="programme" className="text-sm font-medium text-foreground">
                      Programme
                    </Label>
                    <Input
                      id="programme"
                      placeholder="e.g. BEng, BBA, MSc FinTech, etc."
                      value={programme}
                      onChange={(e) => setProgramme(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
              {magicSent ? (
                <p className="text-sm text-muted-foreground">
                  We emailed you a sign-in link. Open it on the same device/browser.
                </p>
              ) : null}
              {magicLinkDetected ? (
                <p className="text-sm text-muted-foreground">
                  Magic link detected. If you opened the link on a different device/browser, re-enter your email then click “Complete sign-in”.
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
                {busy ? "Sending..." : "Email me a magic link (sign up)"}
              </Button>

              {magicLinkDetected ? (
                <Button
                  className="w-full"
                  onClick={() => void completeMagicLink()}
                  disabled={busy || !email.trim()}
                >
                  {busy ? "Completing..." : "Complete sign-in"}
                </Button>
              ) : null}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
