
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, HeartHandshake } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  // Handle login
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      // Login using Better Auth
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message || "Invalid email or password.");
        return;
      }

      // Get the requested destination safely
      const requestedPath = new URLSearchParams(
        window.location.search
      ).get("callbackUrl");

      const nextPath =
        requestedPath?.startsWith("/") &&
        !requestedPath.startsWith("//")
          ? requestedPath
          : "/";

      // Redirect after successful login
      toast.success("Logged in successfully! Welcome back.");
      router.replace(nextPath);
      router.refresh();

    } catch (error) {
      console.error("Login error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

      toast.error("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
  setErrorMessage("");
  setIsGoogleSubmitting(true);

  try {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    if (error) {
      const message =
        error.message || "Google login failed. Please try again.";

      setErrorMessage(message);
      toast.error(message);
    }
  } catch (error) {
    console.error("Google login error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong with Google login.";

    setErrorMessage(message);
    toast.error(message);
  } finally {
    setIsGoogleSubmitting(false);
  }
};

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">

          {/* Header */}
          <div className="mb-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <HeartHandshake className="h-8 w-8" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-heading">
              Welcome Back!
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Log in to continue making a difference.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-field px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-field px-4 py-3 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand-text"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
              >
                {errorMessage}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Logging In..." : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Google Login - OAuth configuration pending */}
         <button
  type="button"
  onClick={handleGoogleLogin}
  disabled={isGoogleSubmitting || isSubmitting}
  className="flex w-full items-center justify-center gap-3 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
>
  <span className="text-lg font-bold">G</span>

  {isGoogleSubmitting
    ? "Connecting to Google..."
    : "Continue with Google"}
</button>

          {/* Register Link */}
          <p className="mt-7 text-center text-sm text-muted-foreground">
            Donot have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-brand-text hover:text-brand-text-hover"
            >
              Create Account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Together, we can create a better future for every child.
        </p>
      </div>
    </main>
  );
}
