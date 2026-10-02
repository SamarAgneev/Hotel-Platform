import { cn } from "@/lib/utils/cn";

/**
 * Royal Horizon Hotel has no real photography — it's a fictional demo
 * property. Rather than fabricate stock-photo-style imagery, every room
 * and gallery image uses one of these restrained gradient/line
 * treatments, keyed by `treatment`. This is a deliberate, disclosed
 * placeholder: swapping in real photography per tenant later only means
 * replacing this component's usage with an <Image>, not touching layout.
 */

const TREATMENTS = {
  dawn: "from-[#f3ddb6] via-[#e2b988] to-[#a9752f]",
  harbor: "from-[#274347] via-[#3c7076] to-[#a9c9c6]",
  study: "from-[#433b2e] via-[#6b6153] to-[#a89d8a]",
  suite: "from-[#e8e1d2] via-[#d4a35f] to-[#a9752f]",
  terrace: "from-[#2f5d62] via-[#a9752f] to-[#e8e1d2]",
} as const;

export type PlaceholderTreatment = keyof typeof TREATMENTS;

export interface PlaceholderArtProps {
  treatment: PlaceholderTreatment;
  alt: string;
  className?: string;
  caption?: string;
}

export function PlaceholderArt({ treatment, alt, className, caption }: PlaceholderArtProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        TREATMENTS[treatment],
        className,
      )}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-25 mix-blend-overlay"
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="210" x2="400" y2="210" stroke="white" strokeWidth="1" />
        <line x1="0" y1="230" x2="400" y2="220" stroke="white" strokeWidth="1" />
        <rect x="40" y="120" width="18" height="90" fill="white" fillOpacity="0.5" />
        <rect x="70" y="90" width="14" height="120" fill="white" fillOpacity="0.35" />
        <rect x="320" y="140" width="20" height="70" fill="white" fillOpacity="0.4" />
      </svg>
      {caption && (
        <span className="absolute bottom-3 left-3 rounded-full bg-black/30 px-2.5 py-1 text-xs text-white">
          {caption}
        </span>
      )}
    </div>
  );
}
