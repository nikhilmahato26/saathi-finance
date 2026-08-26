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

export function IffcoKisanLogo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <svg
      viewBox="0 0 240 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-auto", className)}
      aria-label="IFFCO Kisan Finance Logo"
    >
      {/* Icon */}
      <g transform="translate(6, 6)">
        <circle
          cx="24"
          cy="24"
          r="23"
          fill={mono ? "currentColor" : "#15803D"}
          fillOpacity={mono ? "0.15" : "1"}
          stroke={mono ? "currentColor" : "#166534"}
          strokeWidth="1.5"
        />
        {/* Leaf & Sprout Symbol */}
        <path
          d="M24 10C24 10 33 16 33 26C33 31.5 28.5 36 24 37C19.5 36 15 31.5 15 26C15 16 24 10 24 10Z"
          fill={mono ? "currentColor" : "#FFFFFF"}
        />
        <path
          d="M24 17V35M24 23C27 21 30 22 30 22M24 27C21 25 18 26 18 26"
          stroke={mono ? "#000000" : "#15803D"}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="24" cy="13" r="2" fill={mono ? "currentColor" : "#FBBF24"} />
      </g>
      {/* Wordmark */}
      <text
        x="64"
        y="30"
        fill="currentColor"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="19"
        fontWeight="800"
        letterSpacing="-0.02em"
      >
        IFFCO <tspan fill={mono ? "currentColor" : "#16A34A"}>KISAN</tspan>
      </text>
      <text
        x="64"
        y="46"
        fill="currentColor"
        fillOpacity="0.7"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="9.5"
        fontWeight="700"
        letterSpacing="0.16em"
      >
        RURAL &amp; AGRI FINANCE
      </text>
    </svg>
  );
}

export function SkFinanceLogo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <svg
      viewBox="0 0 220 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-auto", className)}
      aria-label="SK Finance Logo"
    >
      {/* Icon Mark */}
      <g transform="translate(6, 7)">
        <rect
          x="2"
          y="2"
          width="42"
          height="42"
          rx="10"
          fill={mono ? "currentColor" : "#1E3A8A"}
          fillOpacity={mono ? "0.15" : "1"}
        />
        {/* Dynamic Stylized SK */}
        <path
          d="M14 16H24C26.5 16 28 17.5 28 20C28 22.5 26.5 23.5 24 24H18C15.5 24 14 25.5 14 28C14 30.5 15.5 32 18 32H28"
          stroke={mono ? "currentColor" : "#FFFFFF"}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M29 16V32M37 16L30 24L37 32"
          stroke={mono ? "currentColor" : "#F97316"}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      {/* Text */}
      <text
        x="60"
        y="30"
        fill="currentColor"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="21"
        fontWeight="900"
        letterSpacing="-0.03em"
      >
        SK <tspan fill={mono ? "currentColor" : "#1E40AF"}>FINANCE</tspan>
      </text>
      <text
        x="60"
        y="46"
        fill="currentColor"
        fillOpacity="0.7"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="9"
        fontWeight="700"
        letterSpacing="0.14em"
      >
        VEHICLE &amp; MSME LOANS
      </text>
    </svg>
  );
}

export function DmiHousingLogo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <svg
      viewBox="0 0 250 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-auto", className)}
      aria-label="DMI Housing Finance Logo"
    >
      {/* Icon Mark: DMI geometric squares */}
      <g transform="translate(6, 9)">
        <rect x="2" y="2" width="18" height="18" rx="4" fill={mono ? "currentColor" : "#DC2626"} />
        <rect
          x="23"
          y="2"
          width="18"
          height="18"
          rx="4"
          fill={mono ? "currentColor" : "#475569"}
          fillOpacity={mono ? "0.3" : "0.9"}
        />
        <rect
          x="2"
          y="23"
          width="18"
          height="18"
          rx="4"
          fill={mono ? "currentColor" : "#EF4444"}
          fillOpacity={mono ? "0.5" : "0.85"}
        />
        <rect
          x="23"
          y="23"
          width="18"
          height="18"
          rx="4"
          fill={mono ? "currentColor" : "#991B1B"}
        />
      </g>
      {/* Text */}
      <text
        x="58"
        y="29"
        fill="currentColor"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="21"
        fontWeight="900"
        letterSpacing="-0.03em"
      >
        <tspan fill={mono ? "currentColor" : "#DC2626"}>DMI</tspan> HOUSING
      </text>
      <text
        x="58"
        y="45"
        fill="currentColor"
        fillOpacity="0.7"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="9.5"
        fontWeight="700"
        letterSpacing="0.14em"
      >
        FINANCE PVT LTD
      </text>
    </svg>
  );
}

export function AavasLogo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <svg
      viewBox="0 0 240 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-auto", className)}
      aria-label="Aavas Financiers Logo"
    >
      {/* Icon Mark: Aavas distinctive pitched roof + sunrise */}
      <g transform="translate(6, 6)">
        <circle
          cx="24"
          cy="24"
          r="23"
          fill={mono ? "currentColor" : "#1E40AF"}
          fillOpacity={mono ? "0.15" : "1"}
        />
        {/* House contour */}
        <path
          d="M13 26L24 16L35 26V35C35 36.1 34.1 37 33 37H15C13.9 37 13 36.1 13 35V26Z"
          fill={mono ? "currentColor" : "#FFFFFF"}
        />
        {/* Sunrise inside home */}
        <circle cx="24" cy="28" r="4.5" fill={mono ? "#000000" : "#F59E0B"} />
        <path
          d="M24 20V22M18 24L19.5 25.5M30 24L28.5 25.5"
          stroke={mono ? "#000000" : "#F59E0B"}
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </g>
      {/* Text */}
      <text
        x="62"
        y="29"
        fill="currentColor"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="21"
        fontWeight="900"
        letterSpacing="-0.02em"
      >
        AAVAS
      </text>
      <text
        x="62"
        y="45"
        fill={mono ? "currentColor" : "#D97706"}
        fillOpacity={mono ? "0.7" : "1"}
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="9"
        fontWeight="800"
        letterSpacing="0.18em"
      >
        FINANCIERS LIMITED
      </text>
    </svg>
  );
}

export function GrihumLogo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <svg
      viewBox="0 0 250 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-auto", className)}
      aria-label="Grihum Housing Finance Logo"
    >
      {/* Icon Mark: Warm Arch & Sun */}
      <g transform="translate(6, 6)">
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="12"
          fill={mono ? "currentColor" : "#831843"}
          fillOpacity={mono ? "0.15" : "1"}
        />
        <path
          d="M14 34C14 26 19 20 24 20C29 20 34 26 34 34"
          stroke={mono ? "currentColor" : "#FDE047"}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="24" cy="27" r="3.5" fill={mono ? "currentColor" : "#F97316"} />
        <path
          d="M20 34H28"
          stroke={mono ? "currentColor" : "#FFFFFF"}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      {/* Text */}
      <text
        x="64"
        y="29"
        fill="currentColor"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="21"
        fontWeight="900"
        letterSpacing="-0.02em"
      >
        GRIHUM
      </text>
      <text
        x="64"
        y="45"
        fill="currentColor"
        fillOpacity="0.7"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="9"
        fontWeight="700"
        letterSpacing="0.14em"
      >
        HOUSING FINANCE
      </text>
    </svg>
  );
}

export function AadharHousingLogo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <svg
      viewBox="0 0 250 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-auto", className)}
      aria-label="Aadhar Housing Finance Logo"
    >
      {/* Icon Mark */}
      <g transform="translate(6, 6)">
        <circle
          cx="24"
          cy="24"
          r="23"
          fill={mono ? "currentColor" : "#0369A1"}
          fillOpacity={mono ? "0.15" : "1"}
        />
        {/* House & Sunburst contour */}
        <path
          d="M14 25L24 16L34 25V34C34 35.1 33.1 36 32 36H16C14.9 36 14 35.1 14 34V25Z"
          fill={mono ? "currentColor" : "#FFFFFF"}
        />
        <path
          d="M24 22C21.8 22 20 23.8 20 26C20 28.2 21.8 30 24 30C26.2 30 28 28.2 28 26C28 23.8 26.2 22 24 22Z"
          fill={mono ? "#000000" : "#EA580C"}
        />
      </g>
      {/* Text */}
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

export function CapriGlobalLogo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <svg
      viewBox="0 0 240 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-auto", className)}
      aria-label="Capri Global Logo"
    >
      {/* Icon Mark: Geometric dynamic crest */}
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
          fill={mono ? "#FFFFFF" : "#FFFFFF"}
        />
        <circle cx="24" cy="24" r="3" fill={mono ? "currentColor" : "#1D4ED8"} />
      </g>
      {/* Text */}
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
    id: "iffco-kisan",
    name: "IFFCO Kisan Finance",
    shortName: "IFFCO Kisan",
    category: "Agri & Rural",
    tagline: "Empowering rural India with agricultural and equipment financing",
    offerings: ["Tractor Loans", "Agri-Machinery", "Rural MSME", "Dairy & Cattle Loans"],
    maxTenure: "Up to 7 Years",
    interestRateFrom: "8.90% p.a.",
    logo: IffcoKisanLogo,
  },
  {
    id: "sk-finance",
    name: "SK Finance",
    shortName: "SK Finance",
    category: "Vehicle & MSME",
    tagline: "Fast vehicle, commercial fleet, and business growth credit",
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
    tagline: "Digital-first affordable housing and construction financing",
    offerings: ["Home Purchase Loans", "Plot + Construction", "Home Extension", "Balance Transfer"],
    maxTenure: "Up to 30 Years",
    interestRateFrom: "8.65% p.a.",
    logo: DmiHousingLogo,
  },
  {
    id: "aavas-financiers",
    name: "Aavas Financiers",
    shortName: "Aavas",
    category: "Housing Finance",
    tagline: "Fulfilling home dreams in rural and semi-urban India",
    offerings: ["Affordable Home Loans", "Self-Construction Loans", "Home Renovation", "MSME LAP"],
    maxTenure: "Up to 30 Years",
    interestRateFrom: "8.75% p.a.",
    logo: AavasLogo,
  },
  {
    id: "grihum-housing",
    name: "Grihum Housing Finance",
    shortName: "Grihum",
    category: "Housing Finance",
    tagline: "Customer-centric affordable housing and property-backed loans",
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
    tagline: "India's leading affordable housing financier for low-to-middle income groups",
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
