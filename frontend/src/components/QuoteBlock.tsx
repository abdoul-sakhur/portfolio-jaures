import type { Quote } from "@/lib/types";

export function QuoteBlock({ quote }: { quote: Quote }) {
  if (quote.style === "highlighted") {
    return (
      <figure className="rounded-sm bg-blue px-8 py-10 text-paper md:px-12 md:py-14">
        {quote.title && (
          <p className="text-sm uppercase tracking-[0.2em] text-paper/70">{quote.title}</p>
        )}
        <blockquote className="mt-4 font-display text-2xl leading-snug md:text-3xl">
          “{quote.quoteText}”
        </blockquote>
        <figcaption className="mt-6 text-sm text-paper/80">
          {quote.author}
          {quote.authorRole ? `, ${quote.authorRole}` : ""}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="border-l-2 border-lilac pl-6 md:pl-8">
      {quote.title && (
        <p className="text-sm uppercase tracking-[0.2em] text-lilac">{quote.title}</p>
      )}
      <blockquote className="mt-4 font-display text-xl leading-snug text-ink md:text-2xl">
        “{quote.quoteText}”
      </blockquote>
      <figcaption className="mt-4 text-sm text-ink-soft">
        {quote.author}
        {quote.authorRole ? `, ${quote.authorRole}` : ""}
      </figcaption>
    </figure>
  );
}
