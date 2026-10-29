import Hero from "../components/Hero/Hero";
import Features from "../components/Features/Features";
import Stats from "../Stats/Stats";
import LatestArticles from "../components/LatestArticles/LatestArticles";
import CTA from "../components/CTA/CTA";


function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Stats />
      <LatestArticles/>
      <CTA />
    </>
  );
}

export default Home;
