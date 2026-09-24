import { Award, Globe, Palette, Users, Sparkles, type LucideIcon } from "lucide-react";
import type { BioHighlight } from "@/lib/types";
import { Reveal } from "./Reveal";

const ICONS: Record<string, LucideIcon> = {
  globe: Globe,
  palette: Palette,
  award: Award,
  users: Users,
};

export function HighlightsGrid({ highlights }: { highlights: BioHighlight[] }) {
  const sorted = [...highlights].sort((a, b) => a.order - b.order);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {sorted.map((highlight, index) => {
        const Icon = (highlight.icon && ICONS[highlight.icon]) || Sparkles;
        return (
          <Reveal
            key={highlight.id}
            delay={(index % 4) * 80}
            className="rounded-sm border border-line bg-paper p-7 transition hover:border-ink"
          >
            <Icon className="h-6 w-6 text-lilac" strokeWidth={1.5} />
            <h3 className="mt-4 font-display text-lg">{highlight.title}</h3>
            {highlight.description && (
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {highlight.description}
              </p>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}
