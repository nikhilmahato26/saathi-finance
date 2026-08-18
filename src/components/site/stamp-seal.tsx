/**
 * A simple geometric seal mark, in the same angular wing-cut vocabulary as
 * the Saathi Finance logo mark, standing in for the "file gets stamped"
 * moment that runs through the product (see PRODUCT.md's shaped brief).
 * Not the brand logo itself - a supporting graphic for the lead-capture hero.
 */
export function StampSeal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Application seal mark"
    >
      <circle
        cx="120"
        cy="120"
        r="112"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2 7"
        opacity="0.35"
      />
      <circle cx="120" cy="120" r="92" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <path
        d="M76 76 L148 76 L124 100 L148 124 L120 124 L120 164 L92 164 L92 124 L76 124 Z"
        fill="currentColor"
      />
    </svg>
  );
}
