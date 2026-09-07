import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  centered?: boolean;
  className?: string;
  dark?: boolean;
}

export function SectionHeader({ title, subtitle, description, centered = false, className, dark = false }: SectionHeaderProps) {
  return (
    <div className={cn("mb-12 md:mb-20", centered && "text-center mx-auto max-w-3xl", className)}>
      {subtitle && (
        <span className={cn("block text-sm font-bold uppercase tracking-widest mb-3", dark ? "text-primary" : "text-primary")}>
          {subtitle}
        </span>
      )}
      <h2 className={cn(
        "text-3xl md:text-5xl font-black uppercase tracking-tight leading-none mb-6",
        dark ? "text-white" : "text-black"
      )}>
        {title}
      </h2>
      {description && (
        <p className={cn(
          "text-lg leading-relaxed",
          dark ? "text-gray-400" : "text-gray-600"
        )}>
          {description}
        </p>
      )}
    </div>
  );
}
