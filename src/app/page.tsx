import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/sections/Hero";
import { TheShift } from "@/components/sections/TheShift";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FindYourVibe } from "@/components/sections/FindYourVibe";
import { JoinMovement } from "@/components/sections/JoinMovement";
import { CTAFooter } from "@/components/sections/CTAFooter";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <TheShift />
        <HowItWorks />
        <FindYourVibe />
        <JoinMovement />
        <CTAFooter />
      </main>
    </>
  );
}
