import Hero from "./components/Hero";
import RecentPosts from "./components/RecentPosts";
import PopularCategories from "./components/PopularCategories";
import Experts from "./components/Experts";
import RecommendedReads from "./components/RecommendedReads";
import Newsletter from "./components/Newsletter";

export const metadata = {
  title: 'Zdravie v praxi',
  description:
    'Overené informácie, tipy a rady pre zdravý životný štýl – výživa, prevencia, wellness a odborné odporúčania.',
  alternates: {
    canonical: '/',
  },
};

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
