import { cn } from "@/lib/utils/cn";

export interface SectionHeadingProps {
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ title, description, align = "left", className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <h2 className="text-3xl text-text-primary sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-base text-text-secondary">{description}</p>}
    </div>
  );
}
