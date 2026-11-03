
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  HeartHandshake,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Email and Password Registration
  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");

    if (password.length < 6) {
      setErrorMessage("Password must contain at least 6 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setErrorMessage(
        "Password must contain at least one uppercase letter."
      );
      return;
    }

    if (!/[a-z]/.test(password)) {
      setErrorMessage(
        "Password must contain at least one lowercase letter."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message || "Registration failed.");
        return;
      }

      setIsSuccess(true);

      toast.success("Account created successfully! Welcome to EduChild.");
    } catch (error) {
      console.error("Registration error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Registration
  const handleGoogleSignup = async () => {
    setErrorMessage("");

    try {
      setIsGoogleSubmitting(true);

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        const message =
          error.message || "Google registration failed.";

        setErrorMessage(message);
        toast.error(message);
      }
    } catch (error) {
      console.error("Google signup error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to register with Google.";

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
              Create Your Account
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Join our community and start making a difference.
            </p>
          </div>

          {/* Registration Success */}
          {isSuccess ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center dark:border-green-900/50 dark:bg-green-950/30">
              <h2 className="text-lg font-bold text-green-800 dark:text-green-300">
                Registration Successful!
              </h2>

              <p className="mt-2 text-sm text-green-700 dark:text-green-400">
                Your account has been created successfully. Welcome to EduChild!
              </p>

              <Link
                href="/"
                className="mt-5 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
              >
                Continue to Homepage
              </Link>
            </div>
          ) : (
            <>
              {/* Google Sign Up */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isGoogleSubmitting || isSubmitting}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="text-lg font-bold">G</span>

                {isGoogleSubmitting
                  ? "Connecting to Google..."
                  : "Sign Up with Google"}
              </button>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />

                <span className="text-xs text-muted-foreground">
                  OR REGISTER WITH EMAIL
                </span>

                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Email Registration Form */}
              <form onSubmit={handleRegister} className="space-y-5">

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-field px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                  />
                </div>

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
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-field px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
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
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      required
                      className="w-full rounded-lg border border-border bg-field px-4 py-3 pr-12 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand-text"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Minimum 6 characters, including uppercase and lowercase letters.
                  </p>
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || isGoogleSubmitting}
                  className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Creating Account..."
                    : "Create Account"}
                </button>
              </form>
            </>
          )}

          {/* Login Link */}
          {!isSuccess && (
            <p className="mt-7 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-brand-text hover:text-brand-text-hover"
              >
                Log In
              </Link>
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Together, we can create a better future for every child.
        </p>
      </div>
    </main>
  );
}
