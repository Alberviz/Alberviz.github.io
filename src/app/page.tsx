import { PortfolioNavbar } from "@/components/portfolio/PortfolioNavbar";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { WariPortal } from "@/components/portfolio/WariPortal";
import { OlimpoSection } from "@/components/portfolio/OlimpoSection";
import { SystemsSection } from "@/components/portfolio/SystemsSection";
import { DesktopSection } from "@/components/portfolio/DesktopSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { BackgroundSection } from "@/components/portfolio/BackgroundSection";
import { PortfolioFooter } from "@/components/portfolio/PortfolioFooter";
import { CommandPalette } from "@/components/portfolio/CommandPalette";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-bg text-ink">
      <PortfolioNavbar />
      <main className="flex w-full flex-1 flex-col">
        <HeroSection />
        <WariPortal />
        <OlimpoSection />
        <SystemsSection />
        <DesktopSection />
        <ProjectsSection />
        <BackgroundSection />
      </main>
      <PortfolioFooter />
      <CommandPalette />
    </div>
  );
}
