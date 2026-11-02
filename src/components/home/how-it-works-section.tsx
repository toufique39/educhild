
import Link from "next/link";

import {
  Search,
  HandHeart,
  Sprout,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover an Event",
    description:
      "Explore upcoming educational events and discover meaningful volunteer opportunities in your community.",
    icon: Search,
    color: "bg-[#EAF2EC]",
    iconColor: "text-[#226B52]",
  },
  {
    number: "02",
    title: "Join as a Volunteer",
    description:
      "Choose an event that inspires you and join other passionate people who believe in the power of education.",
    icon: HandHeart,
    color: "bg-[#FFF2D9]",
    iconColor: "text-[#A46B13]",
  },
  {
    number: "03",
    title: "Make an Impact",
    description:
      "Share your time, skills, and kindness to create better learning opportunities for children.",
    icon: Sprout,
    color: "bg-[#EAF2EC]",
    iconColor: "text-[#226B52]",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="bg-white/40 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">

          <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-bold tracking-widest text-primary uppercase">
            Simple Process
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            How{" "}
            <span className="text-primary">
              EduChild
            </span>{" "}
            Works
          </h2>

          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Becoming part of a positive change is easier than
            you think. Follow three simple steps and start
            making a difference in children&apos;s education.
          </p>

        </div>

        {/* Steps */}
        <div className="relative mt-16 grid gap-8 md:grid-cols-3 md:gap-6">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center"
              >

                {/* Connecting Line */}
                {index !== 2 && (
                  <div className="absolute left-[calc(50%+45px)] top-7 hidden h-px w-[calc(100%-40px)] border-t-2 border-dashed border-primary/30 md:block" />
                )}

                {/* Icon */}
                <div
                  className={`relative z-10 flex size-20 items-center justify-center rounded-2xl ${step.color} transition duration-300 hover:-translate-y-2 hover:shadow-lg`}
                >
                  <Icon
                    size={34}
                    strokeWidth={1.8}
                    className={step.iconColor}
                  />
                </div>

                {/* Step Number */}
                <span className="mt-5 text-xs font-bold tracking-[0.2em] text-primary">
                  STEP {step.number}
                </span>

                {/* Content */}
                <h3 className="mt-3 text-xl font-bold text-foreground">
                  {step.title}
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
                  {step.description}
                </p>

              </div>
            );
          })}

        </div>

        {/* Bottom CTA */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#153F35] px-6 py-9 text-center sm:px-10 md:flex-row md:text-left">

          <div>
            <h3 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to Make a Difference?
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/70">
              Your small contribution can create a brighter future.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#F3B85D] px-6 py-3.5 text-sm font-bold text-[#243126] transition hover:-translate-y-0.5 hover:bg-[#f6c879]"
          >
            Explore Events
            <ArrowUpRight size={18} />
          </Link>

        </div>

      </div>
    </section>
  );
}
