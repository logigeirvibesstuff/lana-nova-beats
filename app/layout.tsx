import Script from "next/script";
import type { Metadata } from "next";
import { Bebas_Neue, Montserrat } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const montserrat = Montserrat({
  weight: ["300", "900"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PlayerBar } from "@/components/audio/PlayerBar";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Unleashed Gems – Premium Type Beats",
  description:
    "Professional, industry-ready Unleashed Gems type beats with clean mixes and clear licensing.",
  metadataBase:
    typeof process.env.NEXT_PUBLIC_SITE_URL === "string"
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : undefined
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    <html lang="en" className={`${bebasNeue.variable} ${montserrat.variable}`}>
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-NCYFMXP0R3" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-NCYFMXP0R3');
        `}</Script>
      </head>
      <body className="min-h-screen bg-background">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
              <div className="page-container py-8">{children}</div>
            </main>
            <SiteFooter />
            <PlayerBar />
            <a
              href="/account"
              className="fixed right-0 top-1/2 -translate-y-1/2 z-40 w-52 h-80 rounded-l-2xl overflow-hidden shadow-2xl group"
            >
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/affiliate-bg.jpg')" }} />
              <div className="absolute inset-0 bg-black/55 group-hover:bg-black/40 transition-colors" />
              <div className="relative h-full flex flex-col items-center justify-center gap-4 px-4 text-center">
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white">Affiliate program</p>
                <p className="text-white text-xl font-bold leading-tight">Get paid to share.</p>
                <p className="text-white text-xs">Earn 50% commission on every sale through your link.</p>
                <span className="bg-green-500 hover:bg-green-400 text-white text-xs font-bold px-4 py-2 rounded-full">Start earning</span>
              </div>
            </a>
          </div>
        </Providers>
      </body>
    </html>
    </ClerkProvider>
  );
}

