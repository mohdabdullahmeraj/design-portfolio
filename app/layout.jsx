import { Inter, Caveat, Anton, Pinyon_Script } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site-url";
import "./marks.css";
import { MarkFilters } from "@/components/NameMarks";
import Header from "@/components/Header";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import Sounds from "@/components/Sounds";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const hand = Caveat({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-hand", display: "swap" });
// footer only: tall condensed caps + a formal script, like abhishekjha.me's footer
const display = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });
const script = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--font-script", display: "swap" });

export const metadata = {
  metadataBase: new URL(SITE_URL), // absolute URLs for the share image
  title: "Abdullah — Product & Visual Designer",
  description:
    "Mohd. Abdullah Meraj is a product and visual designer from New Delhi, designing apps, websites and brands that feel right.",
};

// Runs before paint so the saved theme never flashes.
// Also marks the intro as seen (for this browser session) so it doesn't flash on reloads.
const themeScript = `try{var d=document.documentElement,t=localStorage.getItem('am:theme');if(t)d.dataset.theme=t;else if(matchMedia('(prefers-color-scheme: dark)').matches)d.dataset.theme='dark';if(sessionStorage.getItem('am:intro')==='1'&&!/[?&]intro/.test(location.search)){d.dataset.intro='seen';d.dataset.revealed=''}}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${hand.variable} ${display.variable} ${script.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {/* Crayon filter shared by every doodle */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <filter id="crayon" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="5" result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="3" xChannelSelector="R" yChannelSelector="G" result="wobbled" />
            <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="2" result="grain" />
            <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.6 0 0 0 1.75" result="mask" />
            <feComposite in="wobbled" in2="mask" operator="in" />
          </filter>
        </svg>
        <MarkFilters />
        <Preloader />
        <Header />
        <Cursor />
        <Sounds />
        {children}
      </body>
    </html>
  );
}
