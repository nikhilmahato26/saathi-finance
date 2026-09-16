export interface ServiceDetail {
  key: string;
  slug: string;
  name: string;
  category: "LOAN" | "INSURANCE" | "TAX" | "BANKING";
  categoryLabel: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  badge: string;
  highlights: string[];
  features: { title: string; description: string }[];
  eligibility: string[];
  documents: string[];
  faqs: { question: string; answer: string }[];
}

export const SERVICES_DATA: ServiceDetail[] = [
  // --- LOANS ---
  {
    key: "HOME_LOAN",
    slug: "home-loan",
    name: "Home Loan",
    category: "LOAN",
    categoryLabel: "Loans",
    tagline: "Rates from 8.40% p.a. • Up to 30 Years Tenure",
    shortDescription: "End-to-end assisted home purchase, plot construction, house purchase, and Loan Against Property (LAP).",
    fullDescription: "Saathi Finance brings you end-to-end assisted home loans with leading banks and NBFCs. From property technical verification and legal title clearance to doorstep paperwork pickup and sanction tracking, our advisors ensure you get the lowest interest rate and maximum loan eligibility.",
    iconName: "Home",
    badge: "Low Interest Rates",
    highlights: ["Up to ₹5 Crore Funding", "Tenure up to 30 Years", "Doorstep KYC & Legal Review", "Balance Transfer Available"],
    features: [
      { title: "Multi-Lender Comparison", description: "We compare rates across SBI, HDFC, ICICI, Axis, and top housing finance companies." },
      { title: "Doorstep Documentation", description: "Our field advisor visits you to collect KYC, property deeds, and income documents." },
      { title: "Transparent Processing", description: "Track your file live with your Saathi Lead ID from login to disbursement." },
      { title: "PMAY & Tax Benefits", description: "Claim up to ₹2 Lakh interest deduction under Section 24 and ₹1.5 Lakh under 80C." },
    ],
    eligibility: [
      "Indian citizens aged 21 to 65 years",
      "Salaried professionals with min. 1 year continuous employment",
      "Self-employed business owners with 2+ years filed ITR",
      "Minimum monthly net income of ₹25,000",
    ],
    documents: [
      "Identity & Address: Aadhaar Card, PAN Card, Passport/Voter ID",
      "Income (Salaried): Last 3 months salary slips, 6 months bank statement, Form 16",
      "Income (Self-Employed): Last 2 years ITR with computation, P&L, 6 months current account statement",
      "Property: Title deeds, builder buyer agreement, approved municipal building plan",
    ],
    faqs: [
      { question: "How much loan amount can I get for a home loan?", answer: "You can get up to 80-90% of the registered agreement value depending on your income profile and property appraisal, up to ₹5 Crore." },
      { question: "Can I transfer my existing high-interest home loan?", answer: "Yes, we facilitate Home Loan Balance Transfer (HLBT) with top lenders along with top-up loan options." },
      { question: "How long does the sanction process take?", answer: "With assisted document collection, in-principle sanction usually takes 3 to 5 business days." },
    ],
  },
  {
    key: "PERSONAL_LOAN",
    slug: "personal-loan",
    name: "Personal Loan",
    category: "LOAN",
    categoryLabel: "Loans",
    tagline: "Unsecured Credit up to ₹40 Lakhs • 24-Hour Approval",
    shortDescription: "Collateral-free personal loans for weddings, travel, emergencies, debt consolidation, or medical needs.",
    fullDescription: "Get instant multi-lender personal loans with zero collateral. Whether you need immediate funds for a family medical emergency, wedding expenses, home renovation, or consolidating high-cost credit cards, our advisors match you to the ideal lender with minimal documentation.",
    iconName: "Wallet",
    badge: "Quick Disbursal",
    highlights: ["Up to ₹40 Lakhs", "Flexible Tenure 1 to 5 Years", "No Collateral Required", "Funds Disbursed in 24-48 Hours"],
    features: [
      { title: "Instant Eligibility Check", description: "Evaluate your pre-approved loan offers without affecting your credit score." },
      { title: "Competitive Rates", description: "Interest rates starting from 10.49% p.a. based on employer category and credit profile." },
      { title: "Zero End-Use Restriction", description: "Use the funds freely for medical treatment, weddings, education, or travel." },
      { title: "Hassle-Free Verification", description: "Fast digital verification with your PAN and net banking statement." },
    ],
    eligibility: [
      "Indian residents aged 21 to 58 years",
      "Salaried employees in private limited, public sector, or government entities",
      "Self-employed professionals with established business vintage",
      "Minimum monthly take-home salary of ₹20,000",
      "CIBIL credit score of 650 or higher",
    ],
    documents: [
      "PAN Card & Aadhaar Card",
      "Last 3 months salary slips",
      "Last 6 months salary bank account statement",
      "Current residence address proof",
    ],
    faqs: [
      { question: "Do I need to submit any collateral or guarantor?", answer: "No, personal loans are 100% unsecured; no property or guarantor is required." },
      { question: "Can I prepay or foreclose my personal loan early?", answer: "Yes, top lenders allow foreclosure or partial prepayment after 6 to 12 EMI cycles." },
    ],
  },
  {
    key: "BUSINESS_LOAN",
    slug: "business-loan",
    name: "Business Loan",
    category: "LOAN",
    categoryLabel: "Loans",
    tagline: "Working Capital & Expansion up to ₹1 Crore",
    shortDescription: "Collateral-free business credit based on banking cash flows, GST turnover, and company vintage.",
    fullDescription: "Fuel your enterprise growth with tailored business loans from Saathi Finance. We assist MSMEs, manufacturers, traders, and service providers in securing working capital, machinery financing, inventory expansion, and vendor payment credit without putting business assets at risk.",
    iconName: "Briefcase",
    badge: "MSME & Business",
    highlights: ["Up to ₹1 Crore Collateral-Free", "GST-Backed Underwriting", "Overdraft & Term Loan Options", "Fast Processing"],
    features: [
      { title: "Customized Repayment", description: "Choose flexible monthly EMIs or structured drop-line overdraft facilities." },
      { title: "Cash Flow Assessment", description: "Loans approved on actual bank banking velocity rather than heavy balance sheet scrutiny." },
      { title: "Quick Sanctions", description: "In-principle approvals delivered within 48 to 72 hours of document pickup." },
      { title: "Tax Deductible Interest", description: "Interest paid on business financing qualifies as a deductible business expense." },
    ],
    eligibility: [
      "Proprietorship, Partnership, LLP, or Private Limited Companies",
      "Minimum business vintage of 2 years",
      "Annual business turnover of ₹30 Lakhs or more",
      "Active GST registration and regular filing history",
    ],
    documents: [
      "PAN Card & Aadhaar of Proprietor/Partners/Directors",
      "Business Registration Certificate (GST, Gumasta, Udyam MSME)",
      "Last 12 months current bank account statements",
      "Last 2 years filed ITR with balance sheet & P&L",
    ],
    faqs: [
      { question: "Can I get a business loan without collateral?", answer: "Yes, we specialize in unsecured business loans up to ₹1 Crore based on your GST turnover and banking transactions." },
      { question: "How is my loan eligibility calculated?", answer: "Lenders evaluate your average monthly balance, turnover trends, profit margins, and existing debt obligations." },
    ],
  },
  {
    key: "VEHICLE_LOAN",
    slug: "vehicle-loan",
    name: "Vehicle Loan",
    category: "LOAN",
    categoryLabel: "Loans",
    tagline: "Up to 100% On-Road Funding • 2-Wheelers to Commercial",
    shortDescription: "Cars, commercial transport trucks, tractors, and two-wheelers. Dealer quote through to disbursement.",
    fullDescription: "Drive home your dream vehicle with seamless vehicle financing. Saathi Finance covers new and pre-owned personal cars, commercial transport vehicles, tractors, and commercial fleets with up to 100% on-road funding and fast dealer payout.",
    iconName: "Car",
    badge: "Fast Auto Finance",
    highlights: ["Up to 100% On-Road Price", "Tenure up to 7 Years", "Covers Cars, Trucks & Tractors", "Instant Dealer Payout"],
    features: [
      { title: "New & Used Vehicles", description: "Competitive rates for showroom purchases as well as certified used car refi." },
      { title: "Tractor & Agro Support", description: "Specialized agricultural credit terms tailored to seasonal harvest cash flows." },
      { title: "Fast Delivery Order", description: "Delivery order (DO) issued quickly so you can take delivery without dealership delays." },
      { title: "Attractive Interest Rates", description: "Rates starting from 8.75% p.a. with minimal processing fees." },
    ],
    eligibility: [
      "Salaried individuals, farmers, and self-employed businessmen",
      "Age between 21 and 65 years",
      "Valid Driving License and residence proof",
      "Minimum income of ₹15,000/month or verified agricultural landholding",
    ],
    documents: [
      "KYC: PAN, Aadhaar Card, Driving License",
      "Income Proof: 6 months bank statement, salary slip or agricultural land records (Khasra/Khatauni)",
      "Vehicle Proforma Invoice / Dealer quotation",
    ],
    faqs: [
      { question: "Does vehicle financing include insurance and RTO charges?", answer: "Yes, on-road funding packages can cover the ex-showroom price, comprehensive insurance, and RTO registration fees." },
      { question: "Can I get a loan for a used or commercial vehicle?", answer: "Absolutely. We finance pre-owned passenger vehicles, commercial pick-up trucks, and tractors." },
    ],
  },

  // --- INSURANCE ---
  {
    key: "INSURANCE_VEHICLE",
    slug: "vehicle-insurance",
    name: "Vehicle Insurance",
    category: "INSURANCE",
    categoryLabel: "Insurance",
    tagline: "Instant Digital Policy • 5,000+ Cashless Garages",
    shortDescription: "Comprehensive and third-party insurance for two-wheelers, private cars, and personal transport.",
    fullDescription: "Protect your vehicle against accidents, theft, fire, and natural disasters. Saathi Finance partners with leading general insurance providers to offer instant digital motor policies with zero paperwork, zero inspection renewals, and cashless claim settlements.",
    iconName: "Shield",
    badge: "Instant e-Policy",
    highlights: ["Up to 80% No Claim Bonus (NCB)", "Cashless Claim Network", "Zero Depreciation Add-on", "24x7 Roadside Assistance"],
    features: [
      { title: "Comprehensive Coverage", description: "Protects against own damage, third-party liability, theft, flood, and fire." },
      { title: "Zero Dep Rider", description: "Receive full claim settlements with zero deduction for plastic, rubber, or metal depreciation." },
      { title: "Instant Policy Delivery", description: "Your valid insurance policy is generated and delivered digitally in minutes." },
      { title: "Engine & Gearbox Protection", description: "Shield your engine from water ingress and hydrostatic lock during heavy rains." },
    ],
    eligibility: ["Any registered vehicle owner with valid RC copy", "New vehicle buyers seeking dealer price discount"],
    documents: ["Vehicle Registration Certificate (RC)", "Previous insurance policy copy (if renewing)", "Aadhaar / PAN of vehicle owner"],
    faqs: [
      { question: "Can I transfer my No Claim Bonus (NCB) from my previous insurer?", answer: "Yes, up to 50% NCB can be seamlessly transferred to your new policy to reduce your premium." },
      { question: "What should I do in case of an accident?", answer: "Notify our support desk or the insurer directly and take the car to any network cashless garage." },
    ],
  },
  {
    key: "INSURANCE_COMMERCIAL_VEHICLE",
    slug: "commercial-vehicle-insurance",
    name: "Commercial Vehicle Insurance",
    category: "INSURANCE",
    categoryLabel: "Insurance",
    tagline: "Heavy Transport, Taxis, Buses & Delivery Fleets",
    shortDescription: "Mandatory third-party liability and comprehensive commercial motor insurance for goods and passenger transport.",
    fullDescription: "Commercial transport is the lifeline of Indian commerce. We offer comprehensive coverage for goods carrying vehicles (mini trucks, multi-axle lorries), passenger carriers (buses, cabs, autorickshaws), and special utility vehicles with quick turnaround claims.",
    iconName: "Truck",
    badge: "Transport & Fleets",
    highlights: ["Goods & Passenger Carriers", "Driver & Cleaner PA Cover", "Third-Party Legal Liability", "Nationwide Cashless Network"],
    features: [
      { title: "Fleet Discounts", description: "Attractive bulk premium savings for operators managing 3 or more vehicles." },
      { title: "Legal Liability Protection", description: "Mandatory compliance cover protecting your business against statutory claims." },
      { title: "Paid Driver Protection", description: "Personal accident cover for designated drivers, conductors, and loaders." },
      { title: "Fast Claim Survey", description: "Expedited on-site and mobile video surveyor support to minimize transport downtime." },
    ],
    eligibility: ["Commercial permit holders, logistics transport operators, and fleet businesses"],
    documents: ["Commercial Vehicle RC", "Fitness Certificate & Route Permit", "Previous Policy & Owner KYC"],
    faqs: [
      { question: "Is passenger liability cover included for cabs and buses?", answer: "Yes, passenger carrying vehicle policies include statutory legal liability cover for authorized passengers." },
    ],
  },
  {
    key: "INSURANCE_TRACTOR",
    slug: "tractor-insurance",
    name: "Tractor Insurance",
    category: "INSURANCE",
    categoryLabel: "Insurance",
    tagline: "Dedicated Agricultural & Commercial Tractor Protection",
    shortDescription: "Tailored protection for farm tractors, attached implements, harvesters, and rural trailers.",
    fullDescription: "Your farm machinery powers your livelihood. Saathi Finance provides specialized agricultural tractor insurance covering physical damage during field cultivation, transit accidents, fire, theft, and third-party liabilities with flexible rural renewal options.",
    iconName: "Tractor",
    badge: "Agri & Rural",
    highlights: ["Covers Farm & Road Use", "Trailer & Implement Add-on", "Theft & Flood Protection", "Affordable Rural Premiums"],
    features: [
      { title: "Agricultural & Haulage Cover", description: "Valid whether using the tractor for field tilling or village haulage work." },
      { title: "Implement & Trolley Protection", description: "Optionally cover rotavators, cultivators, and attached heavy trolleys." },
      { title: "Low-Cost Third Party Cover", description: "Stay completely compliant with Motor Vehicles Act requirements at government-notified tariffs." },
      { title: "Hassle-Free Village Pickup", description: "Our local Saathi advisor handles paperwork right at your village." },
    ],
    eligibility: ["Tractor owners in agricultural or commercial use with registered RC"],
    documents: ["Tractor RC book", "Owner Aadhaar & Mobile", "Previous insurance policy (if available)"],
    faqs: [
      { question: "Does this policy cover damage during farm cultivation?", answer: "Yes, accidental rollover, overturning, and physical damage occurring in fields are covered under comprehensive packages." },
    ],
  },
  {
    key: "INSURANCE_TERM",
    slug: "term-insurance",
    name: "Term Insurance",
    category: "INSURANCE",
    categoryLabel: "Insurance",
    tagline: "High Life Cover up to ₹2 Crore • Low Monthly Premiums",
    shortDescription: "Pure life protection ensuring financial freedom and debt protection for your family.",
    fullDescription: "Secure your family's future with pure risk term life insurance. In the event of unforeseen tragedy, term insurance delivers a guaranteed lump-sum and regular income payout to your nominees, safeguarding their lifestyle, children's education, and outstanding loans.",
    iconName: "ShieldCheck",
    badge: "Life Protection",
    highlights: ["₹1 Crore Cover from ₹490/mo", "Critical Illness Rider", "Accidental Death Benefit", "Tax Savings under 80C"],
    features: [
      { title: "Loan Liability Shield", description: "Ensures your family never loses their home or assets to repay unsettled debts." },
      { title: "Critical Illness Coverage", description: "Accelerated payout upon diagnosis of 36+ major illnesses like cancer or cardiac arrest." },
      { title: "Terminal Illness Benefit", description: "Immediate lump-sum claim payout if diagnosed with a terminal condition." },
      { title: "100% Tax Free Payouts", description: "Claim proceeds are completely exempt from income tax under Section 10(10D)." },
    ],
    eligibility: ["Indian citizens aged 18 to 65 years", "Salaried employees or self-employed professionals with regular income"],
    documents: ["Identity & Address: Aadhaar, PAN", "Income Proof: 3 months salary slip or 2 years ITR", "Medical records (if applicable)"],
    faqs: [
      { question: "What is the difference between term insurance and life insurance endowment?", answer: "Term insurance provides high financial cover at low premiums with zero investment risk, giving your family maximum protection." },
    ],
  },
  {
    key: "INSURANCE_HEALTH",
    slug: "health-insurance",
    name: "Health Insurance",
    category: "INSURANCE",
    categoryLabel: "Insurance",
    tagline: "Cashless Hospitalization across 10,000+ Network Hospitals",
    shortDescription: "Individual, family floater, and senior citizen medical coverage with zero room-rent capping.",
    fullDescription: "Don't let medical emergencies wipe out your hard-earned savings. Saathi Finance brings you health insurance plans offering cashless treatments, daycare procedures, pre and post-hospitalization coverage, and annual free health checkups.",
    iconName: "HeartPulse",
    badge: "Medical Security",
    highlights: ["Cashless Claims in 30 Mins", "Zero Room Rent Capping", "Pre & Post Hospitalization", "Tax Deduction under 80D"],
    features: [
      { title: "Comprehensive Family Floater", description: "Cover yourself, your spouse, and children under one unified sum insured." },
      { title: "No Claim Bonus (NCB)", description: "Sum insured increases up to 100% for every claim-free year without extra premium." },
      { title: "Daycare Treatments", description: "Covers modern surgeries like cataract, dialysis, and chemotherapy requiring <24h stay." },
      { title: "Tax Savings", description: "Save up to ₹75,000 in income tax under Section 80D for yourself and senior citizen parents." },
    ],
    eligibility: ["Adults aged 18 to 65 years (lifetime renewability)", "Dependent children from 90 days to 25 years"],
    documents: ["Aadhaar Card, PAN Card", "Existing medical records (if history of hypertension/diabetes)"],
    faqs: [
      { question: "Are pre-existing diseases covered?", answer: "Yes, pre-existing conditions are covered after a standard waiting period of 2 to 3 years." },
    ],
  },

  // --- TAX & COMPLIANCE ---
  {
    key: "TAX_ITR",
    slug: "itr-filing",
    name: "ITR Filing",
    category: "TAX",
    categoryLabel: "Tax services",
    tagline: "Assisted Tax Filing by Expert CAs • Maximize Deductions",
    shortDescription: "Income tax return preparation and filing for salaried, business owners, capital gains, and professionals.",
    fullDescription: "File your Income Tax Return accurately and on time with Saathi Finance. Our certified chartered accountants and tax professionals review your Form 16, bank interest, capital gains, and freelance receipts to maximize legitimate tax deductions and ensure zero penalty notices.",
    iconName: "Receipt",
    badge: "CA-Assisted",
    highlights: ["Expert CA Review", "Maximum Deductions Claimed", "Audit Support & Notices", "Quick Acknowledgement"],
    features: [
      { title: "Form 16 & AIS Review", description: "We reconcile your AIS, TIS, and 26AS to prevent income mismatch notices from the department." },
      { title: "Capital Gains & Trading", description: "Seamless computation of equity, mutual funds, crypto, and property sale gains." },
      { title: "Old vs New Regime Optimization", description: "We calculate your taxes under both regimes to pick the one saving you the most money." },
      { title: "Loan Eligibility Boost", description: "Consistent filed ITRs significantly increase your bank loan eligibility for future credit." },
    ],
    eligibility: ["Salaried employees", "Self-employed professionals, traders & freelancers", "Individuals with property or stock capital gains"],
    documents: ["PAN Card & Aadhaar Card", "Form 16 / Salary slips", "Bank account statements for the financial year", "Investment proofs (80C, 80D)"],
    faqs: [
      { question: "Why is filing ITR important even if my income is below the taxable limit?", answer: "Filed ITRs act as essential legal proof of income when applying for home/business loans, credit cards, or foreign visas." },
    ],
  },
  {
    key: "TAX_GST",
    slug: "gst-registration-return",
    name: "GST Registration & Return",
    category: "TAX",
    categoryLabel: "Tax services",
    tagline: "New GST Registration & Monthly Filing (GSTR-1, 3B, 9)",
    shortDescription: "Complete GST compliance for traders, wholesalers, service providers, and e-commerce sellers.",
    fullDescription: "Stay 100% compliant with GST regulations without operational headaches. We handle new GST number registration, monthly GSTR-1 and GSTR-3B filings, input tax credit (ITC) reconciliation, and annual GSTR-9 returns with dedicated tax advisor assistance.",
    iconName: "FileSpreadsheet",
    badge: "Business Tax",
    highlights: ["New GST Number in 3-7 Days", "Monthly & Quarterly Filing", "ITC Reconciliation", "Notice Response Assistance"],
    features: [
      { title: "New GSTIN Issuance", description: "Fast document submission and government liaison to obtain your 15-digit GSTIN." },
      { title: "GSTR-1 & GSTR-3B Filing", description: "Timely monthly filings ensuring your buyers receive valid input tax credit." },
      { title: "ITC Mismatch Correction", description: "Reconcile Purchase Register with GSTR-2B to prevent loss of eligible tax credits." },
      { title: "E-Way Bill Setup", description: "Generate compliant transport e-way bills for interstate and intrastate goods movement." },
    ],
    eligibility: ["Businesses with turnover > ₹40L (goods) or ₹20L (services)", "Inter-state sellers, e-commerce vendors, and voluntary registrants"],
    documents: ["PAN Card & Aadhaar of Proprietor/Directors", "Business proof: Electricity bill, Rent Agreement, NOC", "Bank cancelled cheque / statement"],
    faqs: [
      { question: "What happens if I miss a monthly GST return deadline?", answer: "Late filing attracts statutory late fees and interest; our automated reminder service ensures you file well before due dates." },
    ],
  },
  {
    key: "TAX_GUMASTA",
    slug: "gumasta",
    name: "Gumasta (Shop Act License)",
    category: "TAX",
    categoryLabel: "Tax services",
    tagline: "Mandatory Commercial & Retail Establishment License",
    shortDescription: "Municipal Shop & Establishment registration required for retail shops, offices, and commercial spaces.",
    fullDescription: "Operating a retail shop, commercial office, or restaurant requires a valid Gumasta (Shop and Establishment License) from the local municipal corporation. Saathi Finance manages the application, local body fee processing, and fast certificate delivery.",
    iconName: "Store",
    badge: "Shop Act",
    highlights: ["Mandatory Municipal License", "Required for Current Account", "100% Digital Application", "Govt Verified Certificate"],
    features: [
      { title: "Bank Current Account Setup", description: "Gumasta acts as primary legal proof to open a commercial bank current account." },
      { title: "Prevents Municipal Penalties", description: "Protects your business against municipal scrutiny, spot fines, and closure notices." },
      { title: "Fast Delivery", description: "Certificates processed and delivered in 3 to 7 working days." },
      { title: "Renewal Support", description: "Automated reminders before your multi-year municipal license expires." },
    ],
    eligibility: ["Any retail shop, service establishment, workshop, warehouse, or commercial office"],
    documents: ["Owner Aadhaar & PAN", "Proof of Commercial Address (Electricity bill, Rent agreement)", "Shop Board photo with name"],
    faqs: [
      { question: "Can I open a bank current account without Gumasta?", answer: "Most scheduled banks require Shop Act / Gumasta as proof of business existence for proprietorship accounts." },
    ],
  },
  {
    key: "TAX_RTO",
    slug: "rto-registry",
    name: "RTO / Registry Services",
    category: "TAX",
    categoryLabel: "Tax services",
    tagline: "Vehicle RC Transfer, HP Cancellation & NOC Processing",
    shortDescription: "Hassle-free Regional Transport Office paperwork for vehicle ownership transfers and loan clearance.",
    fullDescription: "Avoid long lines and confusing bureaucratic paperwork at the Regional Transport Office. Saathi Finance assists vehicle owners with RC ownership transfers, loan hypothecation (HP) addition/cancellation, state-to-state NOCs, and duplicate RC issuance.",
    iconName: "FileCheck",
    badge: "RTO Compliance",
    highlights: ["RC Ownership Transfer", "Loan HP Clearance (Form 35)", "State NOC Processing", "Duplicate RC Issuance"],
    features: [
      { title: "Hypothecation Removal", description: "Remove the lender's name from your vehicle RC after completing your auto loan." },
      { title: "RC Ownership Transfer", description: "Transfer registration into the buyer's name with Form 29 & 30 legal documentation." },
      { title: "Inter-State NOC", description: "Obtain clearance to transfer and re-register your vehicle in another Indian state." },
      { title: "Doorstep Paperwork", description: "Our field advisor collects the necessary physical forms and RTO documents." },
    ],
    eligibility: ["Any vehicle owner needing RTO modifications or ownership transfer"],
    documents: ["Original RC Book/Smart Card", "Loan NOC / Form 35 (for HP cancellation)", "Buyer & Seller Aadhaar, PAN, and Form 29/30"],
    faqs: [
      { question: "Why is HP cancellation important after loan payoff?", answer: "Until HP is cancelled at the RTO, the vehicle remains legally mortgaged to the bank and cannot be resold." },
    ],
  },
  {
    key: "TAX_OTHER",
    slug: "other-tax-services",
    name: "Other Tax & Compliance",
    category: "TAX",
    categoryLabel: "Tax services",
    tagline: "PAN Card, Udyam MSME, Trademark & Company Legal Services",
    shortDescription: "Essential business and individual regulatory registrations to keep your legal identity secure.",
    fullDescription: "From new PAN card issuance and instant Udyam MSME registration to trademark filing, partnership deed drafting, and annual corporate compliance, Saathi Finance is your one-stop legal and compliance desk.",
    iconName: "Layers",
    badge: "All Legal Desks",
    highlights: ["Udyam MSME Registration", "New / Corrected PAN Card", "Partnership Deed Drafting", "Trademark Advisory"],
    features: [
      { title: "Udyam MSME Certificate", description: "Register for government MSME benefits, subsidies, and priority bank lending." },
      { title: "PAN Verification & Correction", description: "Update name, address, or link Aadhaar-PAN to avoid inoperative status." },
      { title: "Digital Signature Certificate (DSC)", description: "Class 3 DSC tokens issued for tenders, MCA filings, and GST returns." },
      { title: "Business Agreements", description: "Draft legally vetted commercial contracts, rental deeds, and vendor MOUs." },
    ],
    eligibility: ["Entrepreneurs, startups, self-employed individuals, and small businesses"],
    documents: ["Aadhaar, PAN Card, Business Address Proof, Bank details"],
    faqs: [
      { question: "What are the benefits of Udyam MSME registration?", answer: "Udyam certified businesses qualify for lower interest rates on bank loans, exemption on tender earnest money, and government subsidy schemes." },
    ],
  },

  // --- BANKING & CARDS ---
  {
    key: "BANKING_SAVINGS",
    slug: "savings-account",
    name: "Savings Account",
    category: "BANKING",
    categoryLabel: "Banking & cards",
    tagline: "High-Interest Savings Accounts with Top Partner Banks",
    shortDescription: "Zero-balance and premium savings accounts with debit card, mobile app, and high interest yields.",
    fullDescription: "Open a feature-rich savings account with leading partner banks (HDFC, ICICI, Kotak, Axis, IndusInd). Benefit from instant video KYC, high interest rates on daily balances, free digital fund transfers, and complimentary personal accidental insurance.",
    iconName: "Landmark",
    badge: "Partner Banking",
    highlights: ["High Interest Rates", "Zero-Balance Options", "Free Virtual Debit Card", "Instant Video KYC"],
    features: [
      { title: "Zero Paperwork Opening", description: "Complete bank account setup digitally with Aadhaar OTP and video KYC." },
      { title: "Higher Interest on Savings", description: "Earn up to 7% interest p.a. on savings balances with auto-sweep fixed deposit options." },
      { title: "Unlimited Digital Payments", description: "Free and unlimited UPI, IMPS, and NEFT payments via secure mobile banking apps." },
      { title: "Doorstep Account Assistance", description: "Our advisor assists in branch document handoff for senior citizens or rural applicants." },
    ],
    eligibility: ["Indian citizens aged 18 years and above"],
    documents: ["Aadhaar Card (linked with active mobile)", "PAN Card", "Passport-size photograph"],
    faqs: [
      { question: "Can I open an account with zero initial deposit?", answer: "Yes, we partner with banks offering zero-balance digital savings accounts." },
    ],
  },
  {
    key: "BANKING_CURRENT",
    slug: "current-account",
    name: "Current Account",
    category: "BANKING",
    categoryLabel: "Banking & cards",
    tagline: "High-Volume Business Accounts with Overdraft Facility",
    shortDescription: "Commercial current accounts for traders, shops, manufacturers, and corporate entities.",
    fullDescription: "Elevate your business operations with a commercial current account tailored to your cash flow. Enjoy high free cash deposit limits, structured overdraft facilities, multi-city banking, POS machine integration, and bulk vendor payout tools.",
    iconName: "Building2",
    badge: "Commercial Desk",
    highlights: ["High Cash Deposit Limits", "Pre-Approved Overdraft Limit", "Free POS / QR Machine Setup", "Bulk Payout API Integration"],
    features: [
      { title: "Multi-City Banking", description: "Deposit and withdraw cash seamlessly across thousands of bank branches nationwide." },
      { title: "Integrated Payment Gateway", description: "Accept client payments via QR codes, payment links, and POS card swipe machines." },
      { title: "Dedicated Relationship Manager", description: "Direct priority phone support from the partner bank's business banking desk." },
      { title: "Higher Credit Eligibility", description: "Maintaining healthy current account throughput qualifies you for instant business loans." },
    ],
    eligibility: ["Sole Proprietors, Partnership Firms, LLPs, Private & Public Limited Companies"],
    documents: ["Entity PAN Card, Certificate of Incorporation / Gumasta / GST", "Directors/Partners KYC, Board Resolution"],
    faqs: [
      { question: "How much average monthly balance (AMB) is required?", answer: "We offer both zero-balance startup packages and standard current accounts based on expected monthly cash turnover." },
    ],
  },
  {
    key: "BANKING_CREDIT_CARD",
    slug: "credit-card",
    name: "Credit Card",
    category: "BANKING",
    categoryLabel: "Banking & cards",
    tagline: "Lifetime-Free & Cashback Cards from Top Banks",
    shortDescription: "Pre-qualified credit cards with fuel surcharge waivers, lounge access, and rewards.",
    fullDescription: "Access pre-approved credit cards from India's premier issuers. Whether you seek lifetime-free cards, fuel surcharge waivers, grocery cashback, airport lounge access, or emergency credit limits, Saathi Finance matches you to the best card for your lifestyle.",
    iconName: "CreditCard",
    badge: "Rewards & Cashback",
    highlights: ["Lifetime Free Cards Available", "Up to 50 Days Interest-Free", "Complimentary Lounge Access", "Instant Virtual Card"],
    features: [
      { title: "Pre-Approved Offers", description: "Matched against your salary account or ITR with high approval odds." },
      { title: "Cashback & Reward Points", description: "Earn up to 5% cash return on Amazon, Flipkart, Swiggy, and utility bill payments." },
      { title: "Airport Lounge Privileges", description: "Complimentary domestic and international airport lounge visits per quarter." },
      { title: "Zero Fuel Surcharge", description: "1% fuel surcharge waiver across all petrol pumps in India." },
    ],
    eligibility: ["Salaried employees with min. ₹25,000 monthly income", "Self-employed individuals with ITR > ₹4 Lakhs/yr", "Age between 21 and 65 years"],
    documents: ["Aadhaar Card, PAN Card", "Latest 1 month salary slip or latest ITR acknowledgement"],
    faqs: [
      { question: "Are there any joining or annual fees?", answer: "We feature multiple Lifetime Free (LTF) credit card options that carry zero joining and zero renewal fees." },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return SERVICES_DATA.find((s) => s.slug === slug);
}

export function getServiceByKey(key: string): ServiceDetail | undefined {
  return SERVICES_DATA.find((s) => s.key === key);
}

export function getServicesByCategory(category: "LOAN" | "INSURANCE" | "TAX" | "BANKING"): ServiceDetail[] {
  return SERVICES_DATA.filter((s) => s.category === category);
}
