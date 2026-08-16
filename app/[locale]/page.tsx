import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Footer } from "@/components/site/footer";
import { SiteCursor } from "@/components/site/site-cursor";
import { ScrollProgressBar } from "@/components/site/scroll-progress-bar";

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
        <Footer />
      </div>
    </>
  );
}
