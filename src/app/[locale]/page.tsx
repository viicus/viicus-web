import NetworkHero from "@/components/network/NetworkHero";
import Statement from "@/components/network/Statement";
import Pillars from "@/components/network/Pillars";
import Preview from "@/components/network/Preview";
import CtaFooter from "@/components/network/CtaFooter";
import BackToTop from "@/components/BackToTop";

// Hero background network density — kept minimal so the foreground breathes.
const PERSON_COUNT = 60;

export default function HomePage() {
  return (
    <main>
      <NetworkHero personCount={PERSON_COUNT} />
      <Statement />
      <Pillars />
      <Preview />
      <CtaFooter />
      <BackToTop />
    </main>
  );
}
