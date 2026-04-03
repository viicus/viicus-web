import NetworkHero from "@/components/network/NetworkHero";
import HowItWorks from "@/components/network/HowItWorks";
import ReportDemo from "@/components/network/ReportDemo";
import Features from "@/components/network/Features";
import Community from "@/components/network/Community";
import CtaFooter from "@/components/network/CtaFooter";
import BackToTop from "@/components/BackToTop";

const PERSON_COUNT = 80;

export default function HomePage() {
  return (
    <main className="noise-overlay">
      <NetworkHero personCount={PERSON_COUNT} />
      <HowItWorks />
      <ReportDemo />
      <Features />
      <Community />
      <CtaFooter />
      <BackToTop />
    </main>
  );
}
