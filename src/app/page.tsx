import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Package, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ORIGIN_LABELS, ROAST_LABELS } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Kape — Premium Philippine Coffee Subscription",
  description:
    "Subscribe to premium Philippine specialty coffee. Sagada Arabica, Kapeng Barako, and Mount Apo beans delivered to your door in Metro Manila.",
};

const featuredCoffees = [
  {
    name: "Sagada Arabica",
    origin: "SAGADA",
    roast: "MEDIUM",
    price: 450,
    flavorNotes: ["Citrus", "Dark Chocolate", "Floral"],
    image: "/sagada.png",
    badge: "Best Seller",
    badgeVariant: "gold" as const,
  },
  {
    name: "Kapeng Barako",
    origin: "BARAKO",
    roast: "DARK",
    price: 380,
    flavorNotes: ["Bold", "Earthy", "Anise"],
    image: "/barako.png",
    badge: "Heritage",
    badgeVariant: "espresso" as const,
  },
  {
    name: "Mount Apo Reserve",
    origin: "APO",
    roast: "LIGHT",
    price: 520,
    flavorNotes: ["Stone Fruit", "Honey", "Jasmine"],
    image: "/apo.png",
    badge: "Limited",
    badgeVariant: "green" as const,
  },
];

const stats = [
  { value: "3+", label: "Philippine Regions" },
  { value: "500+", label: "Happy Subscribers" },
  { value: "100%", label: "Direct from Farmers" },
  { value: "₱10", label: "Per 100 pts earned" },
];

const howItWorks = [
  {
    step: "01",
    title: "Pick Your Beans",
    description: "Browse our curated selection of single-origin Philippine coffees.",
    icon: Package,
  },
  {
    step: "02",
    title: "Choose Your Cadence",
    description: "Bi-weekly or monthly — your coffee, your schedule.",
    icon: Star,
  },
  {
    step: "03",
    title: "Earn & Redeem",
    description: "Complete quests, earn Kape Points, and unlock checkout discounts.",
    icon: Zap,
  },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* ─── Hero Section ─── */}
      <section
        className="relative min-h-[90vh] flex items-center"
        aria-labelledby="hero-heading"
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="Philippine coffee plantation at sunrise"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-espresso-950/90 via-espresso-950/70 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-2xl">
            <Badge variant="gold" size="lg" className="mb-6">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Delivering to Metro Manila &amp; Caloocan
            </Badge>

            <h1
              id="hero-heading"
              className="font-heading font-bold text-white leading-none tracking-tight mb-6"
              style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
            >
              Taste the{" "}
              <span className="text-gradient-gold">Mountains</span>
              <br />
              of the Philippines
            </h1>

            <p className="text-xl text-espresso-200 leading-relaxed mb-10 max-w-lg">
              Premium single-origin coffee, sourced directly from local Philippine farmers and 
              delivered fresh to your door — bi-weekly or monthly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/subscribe">
                <Button variant="gold" size="lg">
                  Start Your Subscription
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/shop">
                <Button
                  variant="secondary"
                  size="lg"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  Browse Beans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section
        className="bg-espresso-900 py-10"
        aria-label="Kape by the numbers"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-heading text-3xl font-bold text-gold-300">{value}</p>
                <p className="text-sm text-espresso-300 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Coffees ─── */}
      <section
        className="mx-auto max-w-7xl px-6 py-24"
        aria-labelledby="coffees-heading"
      >
        <div className="text-center mb-14">
          <Badge variant="espresso" size="md" className="mb-4">
            Our Collection
          </Badge>
          <h2
            id="coffees-heading"
            className="font-heading font-bold text-espresso-900 text-4xl md:text-5xl mb-4"
          >
            From Highland Farms to Your Cup
          </h2>
          <p className="text-espresso-500 text-lg max-w-xl mx-auto">
            Every bag tells the story of the Philippine terrain it came from.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {featuredCoffees.map((coffee) => (
            <Card key={coffee.name} hover className="overflow-hidden p-0 group">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={coffee.image}
                  alt={`${coffee.name} coffee beans`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant={coffee.badgeVariant} size="md">
                    {coffee.badge}
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-heading font-bold text-espresso-900 text-xl">
                    {coffee.name}
                  </h3>
                  <span className="font-heading font-bold text-espresso-900 text-lg">
                    ₱{coffee.price}
                  </span>
                </div>

                <p className="text-sm text-espresso-500 mb-1">
                  {ORIGIN_LABELS[coffee.origin]}
                </p>
                <p className="text-xs text-espresso-400 mb-4">
                  {ROAST_LABELS[coffee.roast]}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {coffee.flavorNotes.map((note) => (
                    <span
                      key={note}
                      className="text-xs px-2.5 py-1 rounded-full bg-espresso-50 text-espresso-600 border border-espresso-100"
                    >
                      {note}
                    </span>
                  ))}
                </div>

                <Link href={`/subscribe?coffee=${coffee.name.toLowerCase().replace(/\s/g, "-")}`}>
                  <Button variant="primary" size="md" className="w-full">
                    Subscribe
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/shop">
            <Button variant="secondary" size="lg">
              View All Beans
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section
        className="bg-espresso-50 py-24"
        aria-labelledby="how-it-works-heading"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <h2
              id="how-it-works-heading"
              className="font-heading font-bold text-espresso-900 text-4xl mb-4"
            >
              How Kape Works
            </h2>
            <p className="text-espresso-500 text-lg">
              Fresh coffee, loyalty rewards, zero hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {howItWorks.map(({ step, title, description, icon: Icon }) => (
              <div key={step} className="relative text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-espresso-900 text-gold-300 mb-5 shadow-espresso">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 text-xs font-bold text-espresso-300 font-heading">
                  {step}
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

      {/* ─── Loyalty Teaser ─── */}
      <section
        className="mx-auto max-w-7xl px-6 py-24"
        aria-labelledby="loyalty-teaser-heading"
      >
        <div className="rounded-3xl bg-espresso-gradient p-10 md:p-16 overflow-hidden relative">
          <div
            className="absolute -top-20 -right-20 h-72 w-72 rounded-full opacity-10 bg-gold-400"
            aria-hidden="true"
          />
          <div className="relative max-w-2xl">
            <Badge variant="gold" size="lg" className="mb-6">
              <Zap className="h-3.5 w-3.5" aria-hidden="true" />
              Gamified Loyalty
            </Badge>
            <h2
              id="loyalty-teaser-heading"
              className="font-heading font-bold text-white text-4xl md:text-5xl mb-6 leading-tight"
            >
              Complete Quests.
              <br />
              <span className="text-gradient-gold">Earn Kape Points.</span>
            </h2>
            <p className="text-espresso-200 text-lg mb-8 leading-relaxed">
              Refer a friend, write a review, share on socials — every action earns
              points you can redeem for discounts on your next bag.
            </p>
            <Link href="/dashboard/loyalty">
              <Button variant="gold" size="lg">
                View Your Quests
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
