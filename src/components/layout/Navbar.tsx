
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  BookOpenCheck,
  Menu,
  X,
  ChevronDown,
  UserRound,
  CalendarPlus,
  CalendarCheck,
  ListChecks,
  LogOut,
} from "lucide-react";

// User type for future Better Auth integration
export interface NavbarUser {
  name: string;
  image?: string | null;
}

interface NavbarProps {
  user?: NavbarUser | null;
  onSignOut?: () => void;
}

const navLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Upcoming Events",
    href: "/events",
  },
  {
    name: "How It Works",
    href: "/#how-it-works",
  },
];

const profileLinks = [
  {
    name: "Create Event",
    href: "/create-event",
    icon: CalendarPlus,
  },
  {
    name: "Manage Events",
    href: "/manage-events",
    icon: ListChecks,
  },
  {
    name: "Joined Events",
    href: "/joined-events",
    icon: CalendarCheck,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: UserRound,
  },
];

export default function Navbar({
  user = null,
  onSignOut,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="EduChild Home"
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BookOpenCheck size={25} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              EduChild
            </h1>

            <p className="text-xs text-muted-foreground">
              Growing Together
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 lg:flex">

          {!user ? (
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-[#153F35]"
              >
                Join as Volunteer
              </Link>
            </>
          ) : (
            <div className="relative">

              <button
                type="button"
                title={user.name}
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                className="flex items-center gap-2 rounded-full border border-border p-1.5 pr-3 transition hover:bg-secondary"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={36}
                    height={36}
                    unoptimized
                    className="size-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <span className="max-w-32 truncate text-sm font-semibold">
                  {user.name}
                </span>

                <ChevronDown size={16} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 w-56 overflow-hidden rounded-xl border border-border bg-card p-2 shadow-lg">

                  <div className="border-b border-border px-3 py-2">
                    <p className="truncate text-sm font-semibold">
                      {user.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Your account
                    </p>
                  </div>

                  {profileLinks.map((link) => {
                    const Icon = link.icon;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:bg-secondary"
                      >
                        <Icon size={17} />
                        {link.name}
                      </Link>
                    );
                  })}

                  <div className="mt-1 border-t border-border pt-1">
                    <button
                      type="button"
                      disabled={!onSignOut}
                      onClick={onSignOut}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <LogOut size={17} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          className="rounded-lg p-2 transition hover:bg-secondary lg:hidden"
        >
          {mobileOpen ? <X size={25} /> : <Menu size={25} />}
        </button>

      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-5 shadow-lg lg:hidden">

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="rounded-lg px-4 py-3 text-sm font-medium transition hover:bg-secondary hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {user ? (
            <div className="mt-4 border-t border-border pt-4">

              <div className="mb-3 flex items-center gap-3 px-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary font-semibold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your account
                  </p>
                </div>
              </div>

              {profileLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-secondary"
                  >
                    <Icon size={17} />
                    {link.name}
                  </Link>
                );
              })}

              <button
                type="button"
                disabled={!onSignOut}
                onClick={() => {
                  closeMobileMenu();
                  onSignOut?.();
                }}
                className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
              >
                <LogOut size={17} />
                Sign Out
              </button>

            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">

              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="rounded-xl border border-border px-4 py-3 text-center text-sm font-semibold"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={closeMobileMenu}
                className="rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
              >
                Join as Volunteer
              </Link>

            </div>
          )}

        </div>
      )}

    </header>
  );
}
