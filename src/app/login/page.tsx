
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, HeartHandshake } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      router.replace(nextPath);
      router.refresh();

    } catch (error) {
      console.error("Login error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAF7] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">

          {/* Header */}
          <div className="mb-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#226B52] text-white">
              <HeartHandshake className="h-8 w-8" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[#153F35]">
              Welcome Back!
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Log in to continue making a difference.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#1E2E27]"
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
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#226B52] focus:ring-2 focus:ring-[#226B52]/10"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#1E2E27]"
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
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#226B52] focus:ring-2 focus:ring-[#226B52]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#226B52]"
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
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {errorMessage}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#226B52] px-4 py-3 font-semibold text-white transition hover:bg-[#153F35] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Logging In..." : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Google Login - OAuth configuration pending */}
          <button
            type="button"
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-500 opacity-70"
          >
            <span className="text-lg font-bold">G</span>
            Google Login (Coming Soon)
          </button>

          {/* Register Link */}
          <p className="mt-7 text-center text-sm text-gray-500">
            Donot have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#226B52] hover:text-[#153F35]"
            >
              Create Account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Together, we can create a better future for every child.
        </p>
      </div>
    </main>
  );
}
