import { PortfolioNavbar } from "@/components/portfolio/PortfolioNavbar";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { WariPortal } from "@/components/portfolio/WariPortal";
import { HomeLabWealthSection } from "@/components/portfolio/HomeLabWealthSection";
import { DesktopSection, ProjectsSection } from "@/components/portfolio/SelectedWorkSection";
import { ExperienceAndAcademic } from "@/components/portfolio/ExperienceAndAcademic";
import { PortfolioFooter } from "@/components/portfolio/PortfolioFooter";
import { CommandPalette } from "@/components/portfolio/CommandPalette";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-bg text-ink">
      <PortfolioNavbar />
      <main className="flex w-full flex-1 flex-col">
        <HeroSection />
        <WariPortal />
        <HomeLabWealthSection />
        <DesktopSection />
        <ProjectsSection />
        <ExperienceAndAcademic />
      </main>
      <PortfolioFooter />
      <CommandPalette />
    </div>
  );
}
