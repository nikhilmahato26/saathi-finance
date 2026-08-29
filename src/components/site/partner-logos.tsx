import React from "react";
import Image from "next/image";
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
 * Official logo image: Iconic green lowercase 's' + royal indigo 'k' with bold "FINANCE".
 */
export function SkFinanceLogo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <Image
      src="/images/sk-finance-logo.png"
      alt="SK Finance Logo"
      width={164}
      height={114}
      className={cn("h-10 w-auto object-contain", mono && "grayscale opacity-75", className)}
    />
  );
}

/**
 * 3. DMI HOUSING FINANCE Logo
 * Official logo image: Sky blue house outline with rising chart bars and bold wordmark.
 */
export function DmiHousingLogo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <Image
      src="/images/dmi-housing-logo.png"
      alt="DMI Housing Finance Logo"
      width={682}
      height={152}
      className={cn("h-10 w-auto object-contain", mono && "grayscale opacity-75", className)}
    />
  );
}

/**
 * 4. AAVAS FINANCIERS Logo
 * Official logo image: Navy blue & red banner featuring the distinctive "Aavas" wordmark,
 * "FINANCIERS LTD", and tagline "Sapne Aapke, Saath Hamaara".
 */
export function AavasLogo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <Image
      src="/images/aavas-financiers-logo.png"
      alt="Aavas Financiers Logo"
      width={414}
      height={148}
      className={cn("h-10 w-auto object-contain", mono && "grayscale opacity-75", className)}
    />
  );
}

/**
 * 5. GRIHUM HOUSING FINANCE Logo
 * Official logo image: Intertwined dual-gradient ribbon emblem (Red/Orange + Royal Blue),
 * bold "GRIHUM HOUSING FINANCE", horizontal rule, and tagline "Apna Ghar. Apni Pehchan."
 */
export function GrihumLogo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <Image
      src="/images/grihum-logo.png"
      alt="Grihum Housing Finance Logo"
      width={412}
      height={134}
      className={cn("h-10 w-auto object-contain", mono && "grayscale opacity-75", className)}
    />
  );
}

/**
 * 6. Aadhar Housing Finance Logo
 * Official logo image: Red family emblem with blue Aadhar Housing Finance block and tagline.
 */
export function AadharHousingLogo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <Image
      src="/images/aadhar-housing-logo.png"
      alt="Aadhar Housing Finance Logo"
      width={246}
      height={106}
      className={cn("h-10 w-auto object-contain", mono && "grayscale opacity-75", className)}
    />
  );
}

/**
 * 7. Capri Global Logo
 * Official logo image: Capri Loans / Capri Home Loan mark with purple script and pink highlights.
 */
export function CapriGlobalLogo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <Image
      src="/images/capri-global-logo.png"
      alt="Capri Global Housing Finance Logo"
      width={168}
      height={72}
      className={cn("h-10 w-auto object-contain", mono && "grayscale opacity-75", className)}
    />
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

