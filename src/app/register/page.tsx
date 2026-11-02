
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  HeartHandshake,
} from "lucide-react";

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
    } catch (error) {
      console.error("Registration error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
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
        setErrorMessage(
          error.message || "Google registration failed."
        );
      }
    } catch (error) {
      console.error("Google signup error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to register with Google."
      );
    } finally {
      setIsGoogleSubmitting(false);
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
              Create Your Account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Join our community and start making a difference.
            </p>
          </div>

          {/* Registration Success */}
          {isSuccess ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
              <h2 className="text-lg font-bold text-green-800">
                Registration Successful!
              </h2>

              <p className="mt-2 text-sm text-green-700">
                Your account has been created successfully. Welcome to EduChild!
              </p>

              <Link
                href="/"
                className="mt-5 inline-block rounded-lg bg-[#226B52] px-6 py-3 text-sm font-semibold text-white hover:bg-[#153F35]"
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
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="text-lg font-bold">G</span>

                {isGoogleSubmitting
                  ? "Connecting to Google..."
                  : "Sign Up with Google"}
              </button>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />

                <span className="text-xs text-gray-400">
                  OR REGISTER WITH EMAIL
                </span>

                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Email Registration Form */}
              <form onSubmit={handleRegister} className="space-y-5">

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-[#1E2E27]"
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
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#226B52] focus:ring-2 focus:ring-[#226B52]/10"
                  />
                </div>

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
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#226B52] focus:ring-2 focus:ring-[#226B52]/10"
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
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      required
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-12 text-sm outline-none focus:border-[#226B52] focus:ring-2 focus:ring-[#226B52]/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#226B52]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    Minimum 6 characters, including uppercase and lowercase letters.
                  </p>
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || isGoogleSubmitting}
                  className="w-full rounded-lg bg-[#226B52] px-4 py-3 font-semibold text-white transition hover:bg-[#153F35] disabled:cursor-not-allowed disabled:opacity-60"
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
            <p className="mt-7 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#226B52] hover:text-[#153F35]"
              >
                Log In
              </Link>
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Together, we can create a better future for every child.
        </p>
      </div>
    </main>
  );
}
