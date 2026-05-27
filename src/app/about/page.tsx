import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Kape's mission to bring premium Philippine specialty coffee directly from local farmers to your cup.",
};

const values = [
  {
    title: "Direct Trade",
    description: "We work directly with farmers in Sagada, Batangas, and Mount Apo, ensuring they receive fair compensation for their hard work and dedication to quality.",
    icon: Users,
  },
  {
    title: "Uncompromising Quality",
    description: "Every bean is carefully selected, roasted to perfection, and delivered fresh. We believe Philippine coffee can compete on the world stage.",
    icon: Leaf,
  },
  {
    title: "Community First",
    description: "Through our gamified loyalty program, we aim to build a community of coffee lovers who share our passion for local agriculture and culture.",
    icon: Heart,
  },
];

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      {/* ─── Hero Section ─── */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-espresso-950">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/hero-bg.png"
            alt="Coffee farm background"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <Badge variant="gold" size="lg" className="mb-6 mx-auto">
            Our Story
          </Badge>
          <h1
            className="font-heading font-bold text-white leading-none tracking-tight mb-6"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            Elevating <span className="text-gradient-gold">Philippine</span> Coffee
          </h1>
          <p className="text-xl text-espresso-200 leading-relaxed max-w-2xl mx-auto">
            Born out of a deep respect for our local farmers, Kape is on a mission to bring the rich, diverse flavors of the Philippine highlands directly to your morning routine.
          </p>
        </div>
      </section>

      {/* ─── Our Mission ─── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
            <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-espresso group">
              <Image
                src="/barako.png"
                alt="Coffee farmer holding fresh cherries"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-espresso-900/10" />
            </div>
            
            <div>
              <h2 className="font-heading font-bold text-espresso-900 text-4xl mb-6">
                Rooted in Heritage. Driven by Quality.
              </h2>
              <div className="space-y-6 text-lg text-espresso-600 leading-relaxed">
                <p>
                  The Philippines is one of the few countries in the world capable of growing all four commercially viable coffee species: Arabica, Robusta, Liberica (Barako), and Excelsa.
                </p>
                <p>
                  Despite this rich heritage, local specialty coffee often struggles to reach consumers. We started <strong>Kape</strong> to bridge the gap between our hardworking highland farmers and urban coffee enthusiasts in Metro Manila and beyond.
                </p>
                <p>
                  By subscribing to Kape, you aren't just getting a fresh bag of premium beans. You are actively participating in the revitalization of the Philippine coffee industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Core Values ─── */}
      <section className="py-24 bg-espresso-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-espresso-900 text-4xl mb-4">
              What We Stand For
            </h2>
            <p className="text-espresso-500 text-lg max-w-2xl mx-auto">
              Our values guide everything we do, from sourcing beans to how we interact with our subscribers.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {values.map(({ title, description, icon: Icon }) => (
              <div key={title} className="bg-white p-8 rounded-3xl shadow-sm border border-espresso-100 relative group hover:-translate-y-1 transition-transform duration-300">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-espresso-900 text-gold-300 mb-6 group-hover:bg-gold-400 group-hover:text-espresso-900 transition-colors duration-300">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-heading font-bold text-espresso-900 text-xl mb-3">
                  {title}
                </h3>
                <p className="text-espresso-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-heading font-bold text-espresso-900 text-4xl mb-6">
            Ready to Taste the Difference?
          </h2>
          <p className="text-espresso-500 text-lg mb-10">
            Join the Kape community today and experience the finest beans the Philippines has to offer.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/subscribe">
              <Button variant="primary" size="lg">
                Start Subscription
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="secondary" size="lg">
                Browse Shop
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
