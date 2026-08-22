"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface Faq3Props {
  heading?: string;
  description?: string;
  items?: FaqItem[];
}

const defaultFaqItems: FaqItem[] = [
  {
    id: "faq-1",
    question: "How does the loan tracking work on Saathi Finance?",
    answer:
      "Once you share your basic details, a dedicated Saathi Finance advisor is assigned to your file. You receive a unique Lead ID that lets you track your application across all stages—from document collection and verification to lender submission, sanction, and final disbursement.",
  },
  {
    id: "faq-2",
    question: "Do I need to visit physical bank branches for my application?",
    answer:
      "No. Our dedicated advisors handle all the lender liaison, document pickup/verification, and coordination on your behalf so you can complete the entire process remotely.",
  },
  {
    id: "faq-3",
    question: "What financial products can I apply for?",
    answer:
      "We support Home Loans, Vehicle Loans (commercial, personal, tractor), Personal Loans, Business Loans, General & Health Insurance, and Tax/Banking services (ITR, GST, Gumasta).",
  },
  {
    id: "faq-4",
    question: "How quickly will an advisor contact me after submitting details?",
    answer:
      "Over 92% of our customers receive a direct call back from their assigned financial advisor within 24 hours to begin the process.",
  },
  {
    id: "faq-5",
    question: "Is my personal and financial data secure?",
    answer:
      "Yes. We use industry-standard encryption and strict role-based access control. Your documents are shared exclusively with regulated partner banks and NBFCs necessary to process your application.",
  },
  {
    id: "faq-6",
    question: "Are there any upfront charges to check eligibility or track status?",
    answer:
      "No. Tracking your file status and checking your eligibility through Saathi Finance is completely free for all borrowers.",
  },
];

const Faq3 = ({
  heading = "Frequently asked questions",
  description = "Find answers to common questions about our loan and financial tracking services. Can't find what you're looking for? Reach out to our advisor team.",
  items = defaultFaqItems,
}: Faq3Props) => {
  return (
    <section className="py-20 lg:py-28 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col text-left md:text-center">
          <h2 className="mb-3 text-3xl font-semibold tracking-tight sm:text-4xl md:mb-4 lg:mb-6">
            {heading}
          </h2>
          <p className="text-muted-foreground lg:text-lg">{description}</p>
        </div>
        <Accordion
          type="single"
          collapsible
          className="mx-auto mt-12 w-full lg:max-w-3xl"
        >
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="transition-opacity duration-200 hover:no-underline hover:opacity-75">
                <div className="font-medium sm:py-1 lg:py-2 lg:text-lg text-left">
                  {item.question}
                </div>
              </AccordionTrigger>
              <AccordionContent className="sm:mb-1 lg:mb-2">
                <div className="text-muted-foreground leading-relaxed lg:text-base">
                  {item.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export { Faq3 };
