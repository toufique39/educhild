
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  BookOpenCheck,
  Heart,
  Sparkles,
} from "lucide-react";

import VolunteerCta from "@/components/home/volunteer-cta";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">

      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">

        {/* Left Content */}
        <div className="relative z-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-secondary px-4 py-2">
            <Sparkles size={15} className="text-brand-text" />

            <span className="text-xs font-bold tracking-widest text-brand-text uppercase">
              Learn · Grow · Inspire
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="mt-7 max-w-xl text-4xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Every Child Deserves a{" "}
            <span className="relative text-brand-text">
              Chance
            </span>{" "}
            to Learn.
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-lg text-base leading-8 text-muted-foreground sm:text-lg">
            Together, we can create learning opportunities,
            support young learners, and build a brighter future
            for every child.
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">

            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg"
            >
              Explore Events

              <ArrowRight size={18} />
            </Link>

            <VolunteerCta />

          </div>

          {/* Supporting Message */}
          <div className="mt-10 flex items-center gap-3 border-t border-border pt-7">

            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Heart size={20} className="text-brand-text" />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">
                Small Actions. Meaningful Changes.
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Every helping hand can make a difference.
              </p>
            </div>

          </div>

        </div>

        {/* Right Image */}
        <div className="relative mx-auto w-full max-w-xl">

          {/* Decorative Circle */}
          <div className="absolute -right-5 -top-5 size-28 rounded-full border-[16px] border-accent/30" />

          {/* Main Image Container */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-secondary shadow-xl sm:aspect-[5/4]">

            <Image
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=85"
              alt="Children learning together in an educational environment"
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition duration-700 hover:scale-105"
            />

            {/* Image Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#153F35]/40 via-transparent to-transparent" />

            {/* Image Caption */}
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-sm font-semibold text-white sm:text-lg">
                Building brighter futures through education.
              </p>
            </div>

          </div>

          {/* Floating Info Card */}
          <div className="absolute -bottom-7 -left-3 max-w-[230px] rounded-2xl border border-border bg-card p-4 shadow-xl sm:-left-8">

            <div className="flex items-center gap-3">

              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <BookOpenCheck
                  size={23}
                  className="text-brand-text"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-foreground">
                  Learn Together
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Grow Through Community
                </p>
              </div>

            </div>

          </div>

          {/* Decorative Accent */}
          <div className="absolute -right-4 bottom-20 size-12 rounded-xl bg-accent shadow-lg" />

        </div>

      </div>
    </section>
  );
}
