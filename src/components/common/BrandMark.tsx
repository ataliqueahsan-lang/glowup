import Link from "next/link";

export default function BrandMark({ size = "md" }: { size?: "sm" | "md" }) {
  const mark = size === "sm" ? "h-8 w-8 text-sm" : "h-9 w-9 text-base";
  const word = size === "sm" ? "text-xl" : "text-[1.45rem]";

  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 font-semibold tracking-[-0.04em] text-foreground ${word}`}
      aria-label="GlowUp home"
    >
      <span
        className={`grid ${mark} place-items-center rounded-[0.75rem] bg-gradient-to-br from-accent to-[#ffa487] font-serif italic text-text-dark shadow-[0_12px_24px_-15px_rgba(255,128,102,0.85)]`}
        aria-hidden="true"
      >
        G
      </span>
      <span className="tracking-[-0.04em]">
        Glow
        <span className="font-serif italic font-medium text-accent-secondary">
          Up
        </span>
      </span>
    </Link>
  );
}
