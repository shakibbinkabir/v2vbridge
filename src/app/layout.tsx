import type { Metadata } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LocaleProvider } from "@/components/locale/LocaleProvider";
import { getSiteCopy } from "@/lib/content";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from "@/lib/locale";
import { jsonLDScript, organizationLD } from "@/lib/structured-data";

const LOCALE_BOOTSTRAP = `(function(){try{var v=localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)});if(v==="en"||v==="bn"){document.documentElement.setAttribute("lang",v);}}catch(e){}})();`;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://v2vbridge.capec.consulting";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "V2V Bridge — Voice to Venture",
    template: "%s | V2V Bridge",
  },
  description:
    "A youth-led storytelling project amplifying women entrepreneurs in Satkhira, under Plan International Bangladesh's Youth Equality Award 2026.",
  openGraph: {
    title: "V2V Bridge — Voice to Venture",
    description:
      "Voices, podcasts, and reels from women entrepreneurs in Satkhira.",
    url: "/",
    siteName: "V2V Bridge",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
    locale: "en_GB",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const site = getSiteCopy();
  return (
    <html
      lang={DEFAULT_LOCALE}
      suppressHydrationWarning
      className={`${inter.variable} ${hindSiliguri.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: LOCALE_BOOTSTRAP }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <LocaleProvider>
          <Header site={site} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer site={site} />
        </LocaleProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLDScript(organizationLD()) }}
        />
      </body>
    </html>
  );
}
