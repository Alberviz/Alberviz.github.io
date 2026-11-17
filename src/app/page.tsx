import { HeroSection } from "@/components/portfolio/HeroSection";
import { CaseReel } from "@/components/portfolio/CaseReel";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { BackgroundSection } from "@/components/portfolio/BackgroundSection";
import { OLD_ANCHORS } from "@/content/pages";

/**
 * Old links to the single page (/#wari, /#warp...) now live on their own pages.
 * Runs before anything paints, so the visitor never sees the home first.
 */
const REDIRECT_OLD_ANCHORS = `(function(){try{var m=${JSON.stringify(OLD_ANCHORS)};var h=decodeURIComponent(location.hash.slice(1));if(h&&m[h])location.replace(m[h]);}catch(e){}})();`;

export default function HomePage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: REDIRECT_OLD_ANCHORS }} />
      <HeroSection />
      <CaseReel />
      <ProjectsSection />
      <BackgroundSection />
    </>
  );
}
