import Link from "next/link";
import { Coffee, Share2, MessageCircle, Mail } from "lucide-react";

const footerLinks = {
  Product: [
    { href: "/shop", label: "Shop Beans" },
    { href: "/subscribe", label: "Subscriptions" },
    { href: "/dashboard/loyalty", label: "Loyalty Quests" },
  ],
  Company: [
    { href: "/about", label: "About Kape" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-espresso-950 text-espresso-200" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-espresso-800 text-gold-300">
                <Coffee className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="font-heading font-bold text-white text-xl">KAPE</span>
            </Link>
            <p className="text-sm text-espresso-400 leading-relaxed">
              Premium Philippine specialty coffee, delivered to your door. Direct from local farmers.
            </p>

            {/* Social links */}
            <div className="mt-6 flex gap-3">
              {[
                { Icon: Share2, label: "Share", href: "#" },
                { Icon: MessageCircle, label: "Chat", href: "#" },
                { Icon: Mail, label: "Email", href: "#" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-espresso-800 text-espresso-300 hover:bg-espresso-700 hover:text-gold-300 transition-colors duration-200 cursor-pointer"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-heading font-semibold text-white text-sm mb-4 tracking-wide">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-espresso-400 hover:text-gold-300 transition-colors duration-200 cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-espresso-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-espresso-500">
            © {new Date().getFullYear()} Kape. Proudly Philippine-grown.
          </p>
          <p className="text-xs text-espresso-600">
            Serving Metro Manila, Caloocan, and surrounding areas
          </p>
        </div>
      </div>
    </footer>
  );
}
