
import CommunityGallerySection from '@/components/home/community-gallery-section';
import FeaturesSection from '@/components/home/features-section';
import HeroSection from '@/components/home/hero-section';
import HowItWorksSection from '@/components/home/how-it-works-section';
import UpcomingEventsSection from '@/components/home/upcoming-events-section';


const HomePage = () => {
  return (
    <div>
      <HeroSection></HeroSection>
      <FeaturesSection></FeaturesSection>
      <HowItWorksSection></HowItWorksSection>
      <UpcomingEventsSection></UpcomingEventsSection>
      <CommunityGallerySection></CommunityGallerySection>
      
    </div>
  );
};

export default HomePage;