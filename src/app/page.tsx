import { PortfolioNavbar } from "@/components/portfolio/PortfolioNavbar";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { ProofStrip } from "@/components/portfolio/ProofStrip";
import { KrakountSpotlight } from "@/components/portfolio/KrakountSpotlight";
import { HomeLabWealthSection } from "@/components/portfolio/HomeLabWealthSection";
import { SelectedWorkSection } from "@/components/portfolio/SelectedWorkSection";
import { ExperienceAndAcademic } from "@/components/portfolio/ExperienceAndAcademic";
import { PortfolioFooter } from "@/components/portfolio/PortfolioFooter";
import { CommandPalette } from "@/components/portfolio/CommandPalette";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#090A0D] text-[#ECEEF2] selection:bg-[#10B981]/20 selection:text-emerald-300">
      <PortfolioNavbar />
      <main className="flex-1 w-full flex flex-col">
        <HeroSection />
        <ProofStrip />
        <KrakountSpotlight />
        <HomeLabWealthSection />
        <SelectedWorkSection />
        <ExperienceAndAcademic />
      </main>
      <PortfolioFooter />
      <CommandPalette />
    </div>
  );
}
