import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "The Roaster's Notes | Kape Blog",
  description:
    "Stories, brewing guides, and updates from the Kape community and Philippine coffee farms.",
};

const blogPosts = [
  {
    id: 1,
    title: "The Renaissance of Philippine Specialty Coffee",
    excerpt: "How local farmers in Sagada and Mount Apo are elevating the country's coffee profile on the global stage through meticulous processing methods.",
    category: "Origins",
    author: "Tres",
    date: "Oct 12, 2026",
    readTime: "5 min read",
    image: "/sagada.png",
    featured: true,
    slug: "renaissance-of-philippine-specialty-coffee"
  },
  {
    id: 2,
    title: "Brewing the Perfect Kapeng Barako at Home",
    excerpt: "Unlock the bold, earthy flavors of Batangas' famous Liberica beans with this step-by-step French Press guide.",
    category: "Brewing Guides",
    author: "Maria",
    date: "Sep 28, 2026",
    readTime: "3 min read",
    image: "/barako.png",
    featured: false,
    slug: "brewing-perfect-kapeng-barako"
  },
  {
    id: 3,
    title: "Understanding Coffee Processing: Washed vs Natural",
    excerpt: "We break down how post-harvest processing methods drastically alter the flavor profile of your morning cup.",
    category: "Education",
    author: "Tres",
    date: "Sep 15, 2026",
    readTime: "4 min read",
    image: "/apo.png",
    featured: false,
    slug: "understanding-coffee-processing"
  },
  {
    id: 4,
    title: "Meet the Farmers: The Mount Apo Cooperative",
    excerpt: "An inside look into the community producing our limited-edition, award-winning Mount Apo Reserve.",
    category: "Community",
    author: "Juan",
    date: "Aug 30, 2026",
    readTime: "6 min read",
    image: "/hero-bg.png",
    featured: false,
    slug: "meet-the-farmers-mount-apo"
  }
];

export default function BlogPage() {
  const featuredPost = blogPosts.find(post => post.featured) || blogPosts[0];
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="overflow-x-hidden pb-24">
      {/* ─── Header ─── */}
      <section className="bg-espresso-950 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <Badge variant="gold" size="md" className="mb-6">
            The Roaster's Notes
          </Badge>
          <h1
            className="font-heading font-bold text-white leading-none tracking-tight mb-6"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
          >
            Stories from the <span className="text-gradient-gold">Farm</span>
          </h1>
          <p className="text-lg text-espresso-200 max-w-2xl mx-auto">
            Deep dives into coffee origins, brewing guides, and updates directly from the Philippine highlands to your cup.
          </p>
        </div>
      </section>

      {/* ─── Featured Post ─── */}
      <section className="mx-auto max-w-7xl px-6 -mt-8 relative z-10 mb-20">
        <Link href={`/blog/${featuredPost.slug}`} className="block group">
          <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-espresso-100 flex flex-col md:flex-row transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-card-hover">
            <div className="relative w-full md:w-1/2 h-72 md:h-auto overflow-hidden">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="espresso" size="sm">{featuredPost.category}</Badge>
                <span className="text-sm font-medium text-espresso-400">{featuredPost.readTime}</span>
              </div>
              <h2 className="font-heading font-bold text-espresso-900 text-3xl md:text-4xl mb-4 group-hover:text-gold-500 transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-espresso-500 text-lg mb-6 line-clamp-3">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-espresso-100">
                <div className="flex items-center gap-4 text-sm text-espresso-500">
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{featuredPost.date}</span>
                  </div>
                </div>
                <div className="text-espresso-900 group-hover:text-gold-500 transition-colors">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* ─── Recent Posts Grid ─── */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between mb-10">
          <h3 className="font-heading font-bold text-espresso-900 text-3xl">
            Recent Articles
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block group h-full">
              <Card hover className="h-full flex flex-col overflow-hidden p-0 border-0 shadow-sm ring-1 ring-espresso-100">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm border-none shadow-sm">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="font-heading font-bold text-espresso-900 text-xl mb-3 group-hover:text-gold-500 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-espresso-500 text-sm mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-5 border-t border-espresso-100 flex items-center justify-between text-xs text-espresso-400">
                    <span className="font-medium">{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
