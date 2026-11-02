
import Link from "next/link";

import {
  BookOpenCheck,
  Heart,
  Mail,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

const exploreLinks = [
  { name: "Home", href: "/" },
  { name: "Upcoming Events", href: "/events" },
  { name: "How It Works", href: "/#how-it-works" },
];

const involvementLinks = [
  { name: "Create Event", href: "/create-event" },
  { name: "Join as Volunteer", href: "/register" },
  { name: "My Events", href: "/manage-events" },
];

export default function Footer() {
  return (
    <footer className="bg-[#153F35] text-white">

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand Section */}
          <div className="lg:col-span-2">

            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#226B52]">
                <BookOpenCheck size={25} />
              </div>

              <span className="text-2xl font-bold">
                EduChild
              </span>
            </Link>

            <h2 className="mt-7 max-w-md text-3xl font-bold leading-tight sm:text-4xl">
              Every Child Deserves a Chance to Learn.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
              Together, we can create meaningful educational
              opportunities, support young learners, and build
              a brighter future for every child.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 text-sm text-[#F3B85D]">
              <Heart size={16} />
              <span>Growing Together, Changing Lives</span>
            </div>

          </div>

          {/* Explore Links */}
          <div>
            <h3 className="mb-6 text-base font-semibold">
              Explore
            </h3>

            <ul className="space-y-4">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition hover:text-[#F3B85D]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="mb-6 text-base font-semibold">
              Get Involved
            </h3>

            <ul className="space-y-4">
              {involvementLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 text-sm text-white/70 transition hover:text-[#F3B85D]"
                  >
                    {link.name}
                    <ArrowUpRight size={13} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Contact Information */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">

          <div className="flex items-center gap-3 text-sm text-white/70">
            <Mail size={17} className="text-[#F3B85D]" />
            <span>Connect with our community</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-white/70">
            <MapPin size={17} className="text-[#F3B85D]" />
            <span>Building stronger communities through education</span>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} EduChild. All rights reserved.
          </p>

          <p className="text-xs text-white/60">
            Made with care for a brighter tomorrow.
          </p>

        </div>

      </div>

    </footer>
  );
}
