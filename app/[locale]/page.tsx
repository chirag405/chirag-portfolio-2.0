import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Footer } from "@/components/site/footer";
import { SiteCursor } from "@/components/site/site-cursor";
import { ScrollProgressBar } from "@/components/site/scroll-progress-bar";
import { LiveSystemsSection } from "@/components/site/systems/live-systems-section";
import { ExperienceSection } from "@/components/site/experience-section";
import { WorkSection } from "@/components/site/work-section";
import { PublicationsSection } from "@/components/site/publications-section";
import { StackSection } from "@/components/site/stack-section";
import { ChatWidget } from "@/components/site/chat-widget";
import { EasterEgg } from "@/components/site/easter-egg";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ScrollProgressBar />
      <SiteCursor />
      <div className="relative mx-auto max-w-[1240px] px-[clamp(20px,5vw,64px)]">
        <Header />
        <Hero />
        <LiveSystemsSection />
        <ExperienceSection />
        <WorkSection />
        <PublicationsSection />
        <StackSection />
        <Footer />
      </div>
      <ChatWidget />
      <EasterEgg />
    </>
  );
}
