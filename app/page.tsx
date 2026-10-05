import About from "@/components/about";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Offerings from "@/components/offerings";
import SiteHeader from "@/components/site-header";
import Testimonials from "@/components/testimonials";

export default function HomePage() {
  return (
    <main className="bg-gray-900 p-3">
      <SiteHeader username="Learner" />
      <Hero />
      <About />
      <Offerings />
      <Testimonials />
      <Footer />
    </main>
  );
}
