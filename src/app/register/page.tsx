
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  HeartHandshake,
  UserRound,
} from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

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

          {/* Registration Form UI */}
          <form className="space-y-5">
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
                name="name"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#226B52] focus:ring-2 focus:ring-[#226B52]/10"
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
                name="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#226B52] focus:ring-2 focus:ring-[#226B52]/10"
              />
            </div>

            {/* Photo URL */}
            <div>
              <label
                htmlFor="photoURL"
                className="mb-2 block text-sm font-semibold text-[#1E2E27]"
              >
                Profile Photo URL
              </label>

              <input
                id="photoURL"
                name="photoURL"
                type="url"
                placeholder="https://example.com/photo.jpg"
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
                  placeholder="Create a password"
                  autoComplete="new-password"
                  minLength={6}
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

              <p className="mt-2 text-xs leading-5 text-gray-500">
                Password must contain at least 6 characters, one uppercase
                letter, and one lowercase letter.
              </p>
            </div>

            {/* Register Button */}
            <button
              type="button"
              className="w-full rounded-lg bg-[#226B52] px-4 py-3 font-semibold text-white transition hover:bg-[#153F35]"
            >
              Create Account
            </button>

          </form>
 {/* Google Login UI */}
          <button
            type="button"
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-500 opacity-70"
          >
            <span className="text-lg font-bold">G</span>
            Continue with Google
          </button>
          {/* Login Link */}
          <p className="mt-7 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#226B52] hover:text-[#153F35]"
            >
              Log In
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
