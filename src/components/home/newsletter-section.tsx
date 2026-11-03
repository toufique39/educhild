import { BellRing, Mail, Send, ShieldCheck } from "lucide-react";

// Static newsletter subscription section.
// Design-only: there is intentionally no submit handler or API call.
export default function NewsletterSection() {
  return (
    <section className="bg-background px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-[#153F35] px-6 py-16 text-center sm:px-12 lg:py-20">
          {/* Decorative Background */}
          <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-[#F3B85D]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-white/10 blur-3xl" />

          {/* Section Heading */}
          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold tracking-widest text-[#F3B85D] uppercase">
              <BellRing size={14} />
              Newsletter
            </span>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Never Miss an{" "}
              <span className="text-[#F3B85D]">
                Opportunity
              </span>{" "}
              to Help
            </h2>

            <p className="mt-5 text-sm leading-7 text-white/70 sm:text-base">
              Subscribe to our newsletter and get upcoming community
              events, volunteer stories, and meaningful ways to make
              a difference delivered straight to your inbox.
            </p>
          </div>

          {/* Subscription Form (static design, no functionality) */}
          <div className="relative mx-auto mt-9 max-w-xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#153F35]/60"
                />

                <input
                  type="email"
                  placeholder="Enter your email address"
                  aria-label="Email address"
                  className="w-full rounded-xl border border-white/20 bg-white py-3.5 pl-11 pr-4 text-sm text-[#153F35] outline-none transition placeholder:text-[#153F35]/50 focus:border-[#F3B85D] focus:ring-2 focus:ring-[#F3B85D]/40"
                />
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F3B85D] px-7 py-3.5 text-sm font-bold text-[#243126] transition hover:-translate-y-0.5 hover:bg-[#f6c879]"
              >
                Subscribe
                <Send size={16} />
              </button>
            </div>

            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-white/60">
              <ShieldCheck size={14} className="text-[#F3B85D]" />
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
