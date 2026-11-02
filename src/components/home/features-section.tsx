
import {
  BookOpenCheck,
  Users,
  ChartNoAxesCombined,
  ArrowUpRight,
} from "lucide-react";

import Link from "next/link";

const features = [
  {
    icon: BookOpenCheck,
    number: "01",
    title: "Create Learning Events",
    description:
      "Organize meaningful educational events, workshops, and learning activities to create better opportunities for children.",
    iconBg: "bg-[#EAF2EC]",
    iconColor: "text-[#226B52]",
    link: "/create-event",
  },
  {
    icon: Users,
    number: "02",
    title: "Volunteer Together",
    description:
      "Connect with passionate volunteers and become part of a community that believes every child deserves education.",
    iconBg: "bg-[#FFF2D9]",
    iconColor: "text-[#A46B13]",
    link: "/events",
  },
  {
    icon: ChartNoAxesCombined,
    number: "03",
    title: "Track Community Impact",
    description:
      "Celebrate your contributions, follow educational initiatives, and see how collective efforts create meaningful changes.",
    iconBg: "bg-[#EAF2EC]",
    iconColor: "text-[#226B52]",
    link: "/events",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-background px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">

          <span className="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-xs font-bold tracking-widest text-primary uppercase">
            Why EduChild?
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Small Actions,{" "}
            <span className="text-primary">
              Big Differences.
            </span>
          </h2>

          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Every contribution matters. Discover how EduChild
            brings people together to create meaningful
            educational opportunities for children.
          </p>

        </div>

        {/* Feature Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.number}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl sm:p-8"
              >

                {/* Card Number */}
                <div className="flex items-center justify-between">

                  <div
                    className={`flex size-14 items-center justify-center rounded-2xl ${feature.iconBg}`}
                  >
                    <Icon
                      size={27}
                      className={feature.iconColor}
                    />
                  </div>

                  <span className="text-4xl font-bold text-muted/80">
                    {feature.number}
                  </span>

                </div>

                {/* Card Content */}
                <div className="mt-8 flex flex-1 flex-col">

                  <h3 className="text-xl font-bold text-card-foreground transition-colors group-hover:text-primary">
                    {feature.title}
                  </h3>

                  <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">
                    {feature.description}
                  </p>

                  {/* Learn More Link */}
                  <Link
                    href={feature.link}
                    className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3"
                  >
                    Learn More
                    <ArrowUpRight size={17} />
                  </Link>

                </div>

                {/* Decorative Bottom Border */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" />

              </article>
            );
          })}

        </div>

      </div>
    </section>
  );
}
