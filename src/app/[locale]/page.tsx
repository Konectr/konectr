import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";

// Dynamic imports for below-the-fold sections (code splitting)
// These load lazily, reducing initial bundle size significantly
const TheShift = dynamic(() => import("@/components/sections/TheShift").then(mod => ({ default: mod.TheShift })), {
  loading: () => <SectionSkeleton />,
});

const HowItWorks = dynamic(() => import("@/components/sections/HowItWorks").then(mod => ({ default: mod.HowItWorks })), {
  loading: () => <SectionSkeleton />,
});

const FindYourVibe = dynamic(() => import("@/components/sections/FindYourVibe").then(mod => ({ default: mod.FindYourVibe })), {
  loading: () => <SectionSkeleton />,
});

const JoinMovement = dynamic(() => import("@/components/sections/JoinMovement").then(mod => ({ default: mod.JoinMovement })), {
  loading: () => <SectionSkeleton dark />,
});

const CTAFooter = dynamic(() => import("@/components/sections/CTAFooter").then(mod => ({ default: mod.CTAFooter })), {
  loading: () => <SectionSkeleton />,
});

// Minimal skeleton for loading states
function SectionSkeleton({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`py-24 md:py-32 ${dark ? "bg-foreground" : "bg-background"}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="animate-pulse space-y-4">
          <div className={`h-10 w-2/3 mx-auto rounded ${dark ? "bg-white/10" : "bg-muted"}`} />
          <div className={`h-6 w-1/2 mx-auto rounded ${dark ? "bg-white/10" : "bg-muted"}`} />
        </div>
      </div>
    </div>
  );
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      <TheShift />
      <HowItWorks />
      <FindYourVibe />
      <JoinMovement />
      <CTAFooter />
    </main>
  );
}
