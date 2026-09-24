import { Mail, Phone, MapPin } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { Settings } from "@/lib/types";

function InstagramIcon({ className }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path d="M15 8.5h-2a2 2 0 0 0-2 2V22" />
      <path d="M8 13h5" />
      <path d="M2 12a10 10 0 1 0 20 0 10 10 0 0 0-20 0Z" />
    </svg>
  );
}

export function ContactCards({ settings, locale }: { settings: Settings; locale: Locale }) {
  const dict = getDictionary(locale);

  const cards = [
    settings.email && {
      icon: Mail,
      label: dict.contact.email,
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    settings.phone && {
      icon: Phone,
      label: dict.contact.phone,
      value: settings.phone,
      href: `tel:${settings.phone.replace(/\s+/g, "")}`,
    },
    settings.instagramHandles?.[0] && {
      icon: InstagramIcon,
      label: dict.contact.instagram,
      value: settings.instagramHandles[0].handle,
      href: settings.instagramHandles[0].url,
    },
    settings.facebookUrl && {
      icon: FacebookIcon,
      label: dict.contact.facebook,
      value: settings.siteName ?? dict.contact.facebook,
      href: settings.facebookUrl,
    },
    settings.address && {
      icon: MapPin,
      label: dict.contact.address,
      value: settings.address,
      href: undefined,
    },
  ].filter(Boolean) as {
    icon: typeof Mail;
    label: string;
    value: string;
    href?: string;
  }[];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cards.map((card) => {
        const Icon = card.icon;
        const content = (
          <>
            <Icon className="h-5 w-5 text-lilac" strokeWidth={1.5} />
            <div className="mt-3 text-xs uppercase tracking-wide text-ink-soft">
              {card.label}
            </div>
            <div className="mt-1 text-sm font-medium">{card.value}</div>
          </>
        );

        return card.href ? (
          <a
            key={card.label}
            href={card.href}
            target={card.href.startsWith("http") ? "_blank" : undefined}
            rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="rounded-sm border border-line p-6 transition hover:border-ink"
          >
            {content}
          </a>
        ) : (
          <div key={card.label} className="rounded-sm border border-line p-6">
            {content}
          </div>
        );
      })}
    </div>
  );
}
