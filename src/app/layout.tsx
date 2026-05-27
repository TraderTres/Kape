import type { Metadata } from "next";
import { Fira_Code, Fira_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kape — Premium Philippine Coffee Subscription",
    template: "%s | Kape",
  },
  description:
    "Direct-to-consumer specialty coffee from the Philippines. Sagada, Barako, and Apo beans delivered bi-weekly or monthly to Metro Manila and Caloocan.",
  keywords: [
    "Philippine coffee",
    "specialty coffee subscription",
    "Sagada coffee",
    "Barako coffee",
    "Mount Apo coffee",
    "Metro Manila coffee delivery",
  ],
  openGraph: {
    type: "website",
    locale: "en_PH",
    siteName: "Kape",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-PH" className={`${firaCode.variable} ${firaSans.variable}`}>
      <body className="font-body bg-cream text-espresso-950 antialiased">
        <Navbar />
        <main id="main-content" className="min-h-screen pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
