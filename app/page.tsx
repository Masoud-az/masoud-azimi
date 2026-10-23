import About from "@/components/about";
import Reveal from "@/components/animations/reveal";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Offerings from "@/components/offerings";
import SiteHeader from "@/components/site-header";
import Testimonials from "@/components/testimonials";

export default function HomePage() {
  return (
    <main className="bg-background p-3">
      <SiteHeader />

      <Reveal>
        <Hero />
      </Reveal>
      <Reveal delay={0.5}>
        <About />
      </Reveal>
      <Reveal>
        <Offerings />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <Footer />
      </Reveal>
    </main>
  );
}
