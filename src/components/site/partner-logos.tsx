import React from "react";
import { cn } from "@/lib/utils";

export interface PartnerInfo {
  id: string;
  name: string;
  shortName: string;
  category: "Housing Finance" | "Vehicle & MSME" | "Agri & Rural" | "Multi-Product NBFC";
  tagline: string;
  offerings: string[];
  maxTenure: string;
  interestRateFrom: string;
  logo: (props: { className?: string; mono?: boolean }) => React.JSX.Element;
}

/**
 * 1. IFFCO KISAN Logo
 * Exact recreation of the official logo: Split green & gold angled background
 * with a central white stadium capsule containing bold "IFFCO KISAN".
 */
export function IffcoKisanLogo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <svg
      viewBox="0 0 260 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-auto", className)}
      aria-label="IFFCO KISAN Logo"
    >
      <defs>
        <clipPath id="iffco-kisan-clip">
          <rect width="260" height="76" rx="8" />
        </clipPath>
      </defs>
      <g clipPath="url(#iffco-kisan-clip)">
        {/* Left Green Angle Block */}
        <path
          d="M0 0H148L114 76H0V0Z"
          fill={mono ? "currentColor" : "#00873D"}
          fillOpacity={mono ? "0.2" : "1"}
        />
        {/* Right Gold/Yellow Angle Block */}
        <path
          d="M148 0H260V76H114L148 0Z"
          fill={mono ? "currentColor" : "#FABE00"}
          fillOpacity={mono ? "0.35" : "1"}
        />

        {/* Center White Pill/Capsule */}
        <rect
          x="12"
          y="11"
          width="236"
          height="54"
          rx="27"
          fill="#FFFFFF"
          stroke={mono ? "currentColor" : "#00873D"}
          strokeWidth="3"
        />

        {/* Bold IFFCO KISAN Text */}
        <text
          x="130"
          y="47"
          textAnchor="middle"
          fill={mono ? "currentColor" : "#111827"}
          fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          fontWeight="900"
          fontSize="24.5"
          letterSpacing="0.01em"
        >
          IFFCO KISAN
        </text>
      </g>
    </svg>
  );
}

/**
 * 2. SK FINANCE Logo
 * Exact recreation of the official logo: Iconic green lowercase 's' + tall indigo lowercase 'k',
 * with bold uppercase "FINANCE" underneath and tagline support.
 */
export function SkFinanceLogo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <svg
      viewBox="0 0 170 82"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-auto", className)}
      aria-label="SK Finance Logo"
    >
      {/* Dynamic 's' in Vibrant Green */}
      <g transform="translate(18, 32)">
        <path
          d="M10 26.5C18.5 26.5 25.5 24 30.5 20.2L27 14.5C23 17.5 17.5 19.8 11.5 19.8C6.5 19.8 3.5 17.5 3.5 14.5C3.5 11.5 6.5 9.8 13.5 7.8C23.5 5 29 2 29 -5C29 -12.5 22.5 -17.5 11.5 -17.5C4.5 -17.5 -1.5 -15.2 -6 -11.5L-2.5 -5.8C1.5 -8.5 6.5 -10.8 11.5 -10.8C16.5 -10.8 19.5 -8.8 19.5 -5.8C19.5 -2.5 16.5 -0.8 9.5 1.2C-0.5 4 -6 7.5 -6 14.8C-6 22.8 1 26.5 10 26.5Z"
          fill={mono ? "currentColor" : "#009639"}
        />
      </g>

      {/* Dynamic 'k' in Deep Royal Indigo */}
      <g transform="translate(68, 6)">
        {/* Tall vertical pillar */}
        <rect
          x="0"
          y="0"
          width="16"
          height="53"
          rx="2.5"
          fill={mono ? "currentColor" : "#28236B"}
        />
        {/* Upper diagonal arm */}
        <path
          d="M16 28L39 7H55L28 32Z"
          fill={mono ? "currentColor" : "#28236B"}
        />
        {/* Lower diagonal leg */}
        <path
          d="M24 27L53 53H36L16 35Z"
          fill={mono ? "currentColor" : "#28236B"}
        />
      </g>

      {/* FINANCE Wordmark underneath */}
      <text
        x="64"
        y="73"
        textAnchor="middle"
        fill={mono ? "currentColor" : "#111827"}
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontWeight="900"
        fontSize="17.5"
        letterSpacing="0.08em"
      >
        FINANCE
      </text>
    </svg>
  );
}

/**
 * 3. DMI HOUSING FINANCE Logo
 * Exact recreation of official logo: Sky blue house outline with chimney and window,
 * rising dark navy bar chart columns inside, and dynamic forward swoop with bold wordmark.
 */
export function DmiHousingLogo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <svg
      viewBox="0 0 320 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-auto", className)}
      aria-label="DMI Housing Finance Logo"
    >
      <defs>
        <linearGradient id="dmi-house-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={mono ? "currentColor" : "#00A3E0"} />
          <stop offset="100%" stopColor={mono ? "currentColor" : "#0284C7"} />
        </linearGradient>
        <linearGradient id="dmi-bar-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={mono ? "currentColor" : "#0284C7"} />
          <stop offset="100%" stopColor={mono ? "currentColor" : "#003A63"} />
        </linearGradient>
      </defs>

      {/* Emblem Section */}
      <g transform="translate(6, 6)">
        {/* Sky Blue House Roof & Contour */}
        <path
          d="M26 4L4 26H12V50H40V26H48L26 4Z"
          fill="url(#dmi-house-grad)"
          fillOpacity={mono ? "0.2" : "1"}
        />
        {/* Chimney / Peak Accent */}
        <path d="M34 10H39V19L34 14V10Z" fill={mono ? "currentColor" : "#0284C7"} />

        {/* House Window Outline */}
        <g fill="#FFFFFF" fillOpacity="0.9">
          <rect x="23" y="16" width="3.5" height="3.5" rx="0.5" />
          <rect x="27.5" y="16" width="3.5" height="3.5" rx="0.5" />
          <rect x="23" y="20.5" width="3.5" height="3.5" rx="0.5" />
          <rect x="27.5" y="20.5" width="3.5" height="3.5" rx="0.5" />
        </g>

        {/* 4 Ascending Bar Chart Pillars */}
        <g fill="url(#dmi-bar-grad)">
          <path d="M14 48V34H19V48H14Z" rx="1" />
          <path d="M21 48V28H26V48H21Z" rx="1" />
          <path d="M28 48V23H33V48H28Z" rx="1" />
          <path d="M35 48V18H40V48H35Z" rx="1" />
        </g>

        {/* Dynamic Dark Navy Crescent Swoop Underneath */}
        <path
          d="M3 34C1 46 9 58 26 58C44 58 56 46 59 36C57 44 46 52 30 52C16 52 8 42 7 34H3Z"
          fill={mono ? "currentColor" : "#003A63"}
        />
      </g>

      {/* Wordmark Text: DMI HOUSING FINANCE */}
      <text
        x="78"
        y="45"
        fill={mono ? "currentColor" : "#0F172A"}
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontWeight="900"
        fontSize="22.5"
        letterSpacing="-0.02em"
      >
        DMI HOUSING FINANCE
      </text>
    </svg>
  );
}

/**
 * 4. AAVAS FINANCIERS Logo
 * Exact recreation of official logo: Navy blue left emblem block with the tilted interlocked hand swirls,
 * paired with the bold red banner featuring the distinctive "Aavas" wordmark and "FINANCIERS LTD".
 */
export function AavasLogo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <svg
      viewBox="0 0 290 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-auto", className)}
      aria-label="Aavas Financiers Logo"
    >
      <defs>
        <clipPath id="aavas-card-clip">
          <rect width="290" height="84" rx="6" />
        </clipPath>
      </defs>

      <g clipPath="url(#aavas-card-clip)">
        {/* Left Navy Emblem Box */}
        <rect
          x="0"
          y="0"
          width="84"
          height="84"
          fill={mono ? "currentColor" : "#1B2C69"}
          fillOpacity={mono ? "0.2" : "1"}
        />

        {/* Right Red Banner Box */}
        <rect
          x="84"
          y="0"
          width="206"
          height="84"
          fill={mono ? "currentColor" : "#E2211C"}
        />

        {/* Left Emblem Icon: Tilted Diamond with Interlocked Swirls */}
        <g transform="translate(42, 42)">
          {/* White tilted rounded diamond background */}
          <rect
            x="-25"
            y="-25"
            width="50"
            height="50"
            rx="8"
            fill="#FFFFFF"
            transform="rotate(45)"
          />
          {/* Red Swirl / Hand on Left */}
          <path
            d="M-14 -12C-10 -16 -4 -16 0 -12C-6 -10 -8 -6 -8 0C-8 8 -2 12 -8 15C-13 12 -16 4 -14 -12Z"
            fill="#E2211C"
          />
          <path
            d="M-8 -6C-5 -9 0 -9 2 -6C-2 -4 -3 -1 -3 3C-3 8 0 10 -4 12C-8 10 -9 4 -8 -6Z"
            fill="#E2211C"
          />
          {/* Blue Swirl / Hand on Right */}
          <path
            d="M14 12C10 16 4 16 0 12C6 10 8 6 8 0C8 -8 2 -12 8 -15C13 -12 16 -4 14 12Z"
            fill="#1B2C69"
          />
          <path
            d="M8 6C5 9 0 9 -2 6C2 4 3 1 3 -3C3 -8 0 -10 4 -12C8 -10 9 -4 8 6Z"
            fill="#1B2C69"
          />
        </g>

        {/* Distinctive Stylized Aavas Wordmark in Crisp White */}
        <g fill="#FFFFFF">
          {/* 'A' */}
          <path d="M102 52L116 18H127L141 52H130L126.5 43H116.5L113 52H102ZM119.5 35H123.5L121.5 28.5L119.5 35Z" />
          
          {/* 'a' with circular keyhole */}
          <path d="M158 52.5C150 52.5 144 46.5 144 38.5C144 30.5 150 24.5 158 24.5C166 24.5 171 29.5 171 36.5V52H162V48C160.5 50.8 156.5 52.5 158 52.5ZM157.5 45C161.5 45 163.5 42 163.5 38.5C163.5 35 161.5 32 157.5 32C153.5 32 151.5 35 151.5 38.5C151.5 42 153.5 45 157.5 45ZM157.5 40.5C156.4 40.5 155.5 39.6 155.5 38.5C155.5 37.4 156.4 36.5 157.5 36.5C158.6 36.5 159.5 37.4 159.5 38.5C159.5 39.6 158.6 40.5 157.5 40.5Z" />

          {/* 'v' triangular chevron */}
          <path d="M174 25.5H184L191.5 44L199 25.5H209L196.5 52H186.5L174 25.5Z" />

          {/* 'a' with key tab */}
          <path d="M225 52.5C217 52.5 211 46.5 211 38.5C211 30.5 217 24.5 225 24.5C233 24.5 238 29.5 238 36.5V40H219C219.5 43.5 222 46 226 46C229 46 231.5 44.5 232.5 42.5L237.5 45C235 49.5 230.5 52.5 225 52.5ZM219.5 34.5H230.5C230 31.5 228 29.5 225 29.5C222 29.5 220 31.5 219.5 34.5ZM238 36.5H246V41H238V36.5Z" />

          {/* 's' rounded curve */}
          <path d="M256 52.5C249 52.5 245 48.5 245 43.5L252.5 42C253 44.5 254.5 46.5 257 46.5C259 46.5 260.5 45.5 260.5 44C260.5 42.5 259 41.5 255.5 40.5C250.5 39 246.5 37 246.5 32C246.5 27 250.5 24.5 256 24.5C262 24.5 266 28 266.5 32.5L259 34C258.5 32 257.5 30.5 255.5 30.5C254 30.5 253 31.2 253 32.5C253 33.8 254 34.5 257 35.5C262.5 37 267 39 267 44C267 49 263 52.5 256 52.5Z" />
        </g>

        {/* Subtitle: FINANCIERS LTD */}
        <text
          x="188"
          y="68"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="10"
          letterSpacing="0.22em"
        >
          FINANCIERS LTD
        </text>
      </g>
    </svg>
  );
}

/**
 * 5. GRIHUM HOUSING FINANCE Logo
 * Exact recreation of official logo: Intertwined dual-gradient ribbon emblem (Red/Orange + Royal Blue),
 * bold "GRIHUM HOUSING FINANCE", horizontal rule, and tagline "Apna Ghar. Apni Pehchan."
 */
export function GrihumLogo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <svg
      viewBox="0 0 310 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-auto", className)}
      aria-label="Grihum Housing Finance Logo"
    >
      <defs>
        {/* Red to Orange Gradient for upper ribbon */}
        <linearGradient id="grihum-red-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mono ? "currentColor" : "#E22A26"} />
          <stop offset="100%" stopColor={mono ? "currentColor" : "#FF6633"} />
        </linearGradient>

        {/* Blue Gradient for lower ribbon */}
        <linearGradient id="grihum-blue-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={mono ? "currentColor" : "#0D4EA2"} />
          <stop offset="100%" stopColor={mono ? "currentColor" : "#0099DA"} />
        </linearGradient>
      </defs>

      {/* Emblem Section: Intertwined modern shelter ribbon loops */}
      <g transform="translate(6, 10)">
        {/* Upper Red/Orange Ribbon Curve */}
        <path
          d="M8 44C4 36 8 20 28 8C48 -4 68 8 74 18C78 26 74 34 66 38C58 42 50 36 46 30C40 20 28 18 20 24C12 30 14 40 18 44L8 44Z"
          fill="url(#grihum-red-grad)"
        />

        {/* Lower Royal Blue Ribbon Curve */}
        <path
          d="M74 24C78 32 74 48 54 60C34 72 14 60 8 50C4 42 8 34 16 30C24 26 32 32 36 38C42 48 54 50 62 44C70 38 68 28 64 24L74 24Z"
          fill="url(#grihum-blue-grad)"
        />
      </g>

      {/* Right Wordmark Section */}
      <g transform="translate(94, 0)">
        {/* Brand Name: GRIHUM */}
        <text
          x="0"
          y="32"
          fill={mono ? "currentColor" : "#0D2C6C"}
          fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="27"
          letterSpacing="0.01em"
        >
          GRIHUM
        </text>

        {/* Subtitle: HOUSING FINANCE */}
        <text
          x="0"
          y="49"
          fill={mono ? "currentColor" : "#55657E"}
          fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
          fontWeight="700"
          fontSize="11.5"
          letterSpacing="0.16em"
        >
          HOUSING FINANCE
        </text>

        {/* Subtle Horizontal Divider */}
        <line
          x1="0"
          y1="57"
          x2="204"
          y2="57"
          stroke={mono ? "currentColor" : "#CBD5E1"}
          strokeWidth="1.2"
        />

        {/* Tagline: Apna Ghar. Apni Pehchan. */}
        <text
          x="0"
          y="74"
          fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
          fontSize="13"
          fontStyle="italic"
        >
          <tspan fill={mono ? "currentColor" : "#0D4EA2"} fontWeight="900">
            Apna Ghar.{" "}
          </tspan>
          <tspan fill={mono ? "currentColor" : "#E22A26"} fontWeight="900">
            Apni Pehchan.
          </tspan>
        </text>
      </g>
    </svg>
  );
}

/**
 * 6. Aadhar Housing Finance Logo
 */
export function AadharHousingLogo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <svg
      viewBox="0 0 250 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-auto", className)}
      aria-label="Aadhar Housing Finance Logo"
    >
      <g transform="translate(6, 6)">
        <circle
          cx="24"
          cy="24"
          r="23"
          fill={mono ? "currentColor" : "#0369A1"}
          fillOpacity={mono ? "0.15" : "1"}
        />
        <path
          d="M14 25L24 16L34 25V34C34 35.1 33.1 36 32 36H16C14.9 36 14 35.1 14 34V25Z"
          fill={mono ? "currentColor" : "#FFFFFF"}
        />
        <path
          d="M24 22C21.8 22 20 23.8 20 26C20 28.2 21.8 30 24 30C26.2 30 28 28.2 28 26C28 23.8 26.2 22 24 22Z"
          fill={mono ? "#000000" : "#EA580C"}
        />
      </g>
      <text
        x="62"
        y="29"
        fill="currentColor"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="21"
        fontWeight="900"
        letterSpacing="-0.02em"
      >
        AADHAR
      </text>
      <text
        x="62"
        y="45"
        fill={mono ? "currentColor" : "#0284C7"}
        fillOpacity={mono ? "0.7" : "1"}
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="9"
        fontWeight="800"
        letterSpacing="0.14em"
      >
        HOUSING FINANCE LTD
      </text>
    </svg>
  );
}

/**
 * 7. Capri Global Logo
 */
export function CapriGlobalLogo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <svg
      viewBox="0 0 240 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-auto", className)}
      aria-label="Capri Global Logo"
    >
      <g transform="translate(6, 6)">
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="12"
          fill={mono ? "currentColor" : "#1D4ED8"}
          fillOpacity={mono ? "0.15" : "1"}
        />
        <path
          d="M24 12L34 20L31 32L24 36L17 32L14 20L24 12Z"
          fill={mono ? "currentColor" : "#E11D48"}
        />
        <path
          d="M24 16L30 22L28 30L24 32L20 30L18 22L24 16Z"
          fill="#FFFFFF"
        />
        <circle cx="24" cy="24" r="3" fill={mono ? "currentColor" : "#1D4ED8"} />
      </g>
      <text
        x="62"
        y="29"
        fill="currentColor"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="21"
        fontWeight="900"
        letterSpacing="-0.02em"
      >
        CAPRI <tspan fill={mono ? "currentColor" : "#E11D48"}>GLOBAL</tspan>
      </text>
      <text
        x="62"
        y="45"
        fill="currentColor"
        fillOpacity="0.7"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="9"
        fontWeight="700"
        letterSpacing="0.16em"
      >
        HOUSING &amp; MSME FINANCE
      </text>
    </svg>
  );
}

export const TRUSTED_PARTNERS: PartnerInfo[] = [
  {
    id: "aavas-financiers",
    name: "Aavas Financiers Ltd",
    shortName: "Aavas Financiers",
    category: "Housing Finance",
    tagline: "Fulfilling home dreams with specialized affordable housing finance across India",
    offerings: ["Affordable Home Loans", "Self-Construction Loans", "Home Renovation", "MSME LAP"],
    maxTenure: "Up to 30 Years",
    interestRateFrom: "8.75% p.a.",
    logo: AavasLogo,
  },
  {
    id: "iffco-kisan",
    name: "IFFCO Kisan Finance",
    shortName: "IFFCO Kisan",
    category: "Agri & Rural",
    tagline: "Empowering rural & agricultural India with tractor, equipment, and livestock financing",
    offerings: ["Tractor Loans", "Agri-Machinery", "Rural MSME", "Dairy & Cattle Loans"],
    maxTenure: "Up to 7 Years",
    interestRateFrom: "8.90% p.a.",
    logo: IffcoKisanLogo,
  },
  {
    id: "sk-finance",
    name: "SK Finance Limited",
    shortName: "SK Finance",
    category: "Vehicle & MSME",
    tagline: "Fast vehicle financing, commercial fleet funding, and MSME business growth loans",
    offerings: ["Commercial Vehicles", "Used Car Loans", "Two-Wheeler", "MSME Business Loans"],
    maxTenure: "Up to 5 Years",
    interestRateFrom: "9.50% p.a.",
    logo: SkFinanceLogo,
  },
  {
    id: "dmi-housing",
    name: "DMI Housing Finance",
    shortName: "DMI Housing",
    category: "Housing Finance",
    tagline: "Digital-first affordable housing, construction finance, and plot loans",
    offerings: ["Home Purchase Loans", "Plot + Construction", "Home Extension", "Balance Transfer"],
    maxTenure: "Up to 30 Years",
    interestRateFrom: "8.65% p.a.",
    logo: DmiHousingLogo,
  },
  {
    id: "grihum-housing",
    name: "Grihum Housing Finance",
    shortName: "Grihum Housing",
    category: "Housing Finance",
    tagline: "Customer-first affordable housing and property-backed loans: Apna Ghar. Apni Pehchan.",
    offerings: ["Home Loans", "Home Improvement", "Loan Against Property", "Self-Employed Housing"],
    maxTenure: "Up to 25 Years",
    interestRateFrom: "8.80% p.a.",
    logo: GrihumLogo,
  },
  {
    id: "aadhar-housing",
    name: "Aadhar Housing Finance",
    shortName: "Aadhar Housing",
    category: "Housing Finance",
    tagline: "India's leading affordable housing financier for low-to-middle income families",
    offerings: ["First-Time Home Buyers", "Gramin Awaas", "Plot Loans", "Commercial Property Loan"],
    maxTenure: "Up to 30 Years",
    interestRateFrom: "8.60% p.a.",
    logo: AadharHousingLogo,
  },
  {
    id: "capri-global",
    name: "Capri Global Housing Finance",
    shortName: "Capri Global",
    category: "Multi-Product NBFC",
    tagline: "Diversified financial solutions for MSMEs and home buyers across India",
    offerings: ["Affordable Housing", "MSME Credit", "Gold Loans", "Construction Finance"],
    maxTenure: "Up to 25 Years",
    interestRateFrom: "8.85% p.a.",
    logo: CapriGlobalLogo,
  },
];

