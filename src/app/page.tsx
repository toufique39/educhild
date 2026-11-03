
import { Suspense } from "react";

import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home/features-section";
import HowItWorksSection from "@/components/home/how-it-works-section";
import UpcomingEventsSection from "@/components/home/upcoming-events-section";
import CommunityGallerySection from "@/components/home/community-gallery-section";
import NewsletterSection from "@/components/home/newsletter-section";
import { EventGridSkeleton } from "@/components/layout/event-grid-skeleton";

export default function HomePage() {
  return (
    <main>
      <HeroSection />

      <FeaturesSection />

      <HowItWorksSection />

      <Suspense fallback={<EventGridSkeleton count={6} />}>
        <UpcomingEventsSection />
      </Suspense>

      <CommunityGallerySection />

      <NewsletterSection />

    </main>
  );
}
