import Hero from "./components/Hero";
import RecentPosts from "./components/RecentPosts";
import PopularCategories from "./components/PopularCategories";
import Experts from "./components/Experts";
import RecommendedReads from "./components/RecommendedReads";
import Newsletter from "./components/Newsletter";
export default function Home() {
  return (
    <div>
      <Hero />
      <RecentPosts />
      <PopularCategories />
      <Experts />
      <RecommendedReads />
      <Newsletter/>
    </div>
  );
}
