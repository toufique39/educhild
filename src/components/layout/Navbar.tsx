
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HeartHandshake,
  Menu,
  X,
  ChevronDown,
  LogOut,
  PlusCircle,
  ClipboardList,
  CalendarCheck,
  UserRound,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  // Better Auth session
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  // UI states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  // Navigation links
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Upcoming Events", href: "/events" },
    { name: "How It Works", href: "/#how-it-works" },
  ];

  // Generate user initials
  const getInitials = (name: string) => {
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // Logout handler
  const handleLogout = async () => {
    setLogoutError("");

    try {
      setIsLoggingOut(true);

      await authClient.signOut();

      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);

      setLogoutError(
        error instanceof Error
          ? error.message
          : "Unable to log out. Please try again."
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Check active navigation link
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/#how-it-works") return false;

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Navigation link styles
  const getLinkClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      isActive(href)
        ? "text-[#226B52]"
        : "text-[#1E2E27] hover:text-[#226B52]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#226B52] text-white">
            <HeartHandshake className="h-6 w-6" />
          </div>

          <span className="text-xl font-bold tracking-tight text-[#153F35]">
            EduChild
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={getLinkClass(link.href)}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-100" />
          ) : user ? (
            /* Logged-in User Profile */
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setLogoutError("");
                }}
                title={user.name}
                aria-expanded={isProfileOpen}
                className="flex items-center gap-2 rounded-full border border-gray-200 py-1.5 pl-2 pr-3 transition hover:bg-gray-50"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={`${user.name} profile`}
                    className="h-9 w-9 rounded-full object-cover"
                    height={30}
                    width={30}
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#226B52] text-sm font-semibold text-white">
                    {getInitials(user.name || "User")}
                  </div>
                )}

                <span className="max-w-28 truncate text-sm font-semibold text-[#153F35]">
                  {user.name || "Volunteer"}
                </span>

                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">

                  <div className="border-b border-gray-100 px-4 py-4">
                    <p className="truncate text-sm font-semibold text-[#153F35]">
                      {user.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>

                  <Link
  href="/profile"
  onClick={() => setIsProfileOpen(false)}
  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-[#226B52]/10 hover:text-[#226B52]"
>
  <UserRound className="h-4 w-4" />
  My Profile
</Link>

                  <div className="p-2">
                    <Link
                      href="/create-event"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-[#226B52]/10 hover:text-[#226B52]"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Create Event
                    </Link>

                    <Link
                      href="/manage-events"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-[#226B52]/10 hover:text-[#226B52]"
                    >
                      <ClipboardList className="h-4 w-4" />
                      Manage Events
                    </Link>

                    <Link
                      href="/joined-events"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-[#226B52]/10 hover:text-[#226B52]"
                    >
                      <CalendarCheck className="h-4 w-4" />
                      Joined Events
                    </Link>
                  </div>

                  {logoutError && (
                    <p className="px-4 pb-2 text-xs text-red-600">
                      {logoutError}
                    </p>
                  )}

                  <div className="border-t border-gray-100 p-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      <LogOut className="h-4 w-4" />

                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Guest Navigation */
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-[#226B52] transition hover:bg-[#226B52]/10"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-[#226B52] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#153F35]"
              >
                Join as Volunteer
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-lg p-2 text-[#153F35] transition hover:bg-gray-100 md:hidden"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-5 shadow-lg md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`rounded-lg px-4 py-3 ${getLinkClass(link.href)}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4">
            {isPending ? (
              <div className="h-10 animate-pulse rounded-lg bg-gray-100" />
            ) : user ? (
              <div>
                {/* Mobile User Information */}
                <div className="mb-4 flex items-center gap-3 px-3">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={`${user.name} profile`}
                      className="h-11 w-11 rounded-full object-cover"
                      width={44}
                      height={44}
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#226B52] text-sm font-semibold text-white">
                      {getInitials(user.name || "User")}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#153F35]">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Link
  href="/profile"
  onClick={() => setIsProfileOpen(false)}
  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-[#226B52]/10 hover:text-[#226B52]"
>
  <UserRound className="h-4 w-4" />
  My Profile
</Link>

                <Link
                  href="/create-event"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Event
                </Link>

                <Link
                  href="/manage-events"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <ClipboardList className="h-4 w-4" />
                  Manage Events
                </Link>

                <Link
                  href="/joined-events"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Joined Events
                </Link>

                {logoutError && (
                  <p className="px-4 py-2 text-xs text-red-600">
                    {logoutError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg border border-[#226B52] px-4 py-3 text-center text-sm font-semibold text-[#226B52]"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg bg-[#226B52] px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Join as Volunteer
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
