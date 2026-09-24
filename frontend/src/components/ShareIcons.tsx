export function ShareIcons({ url, title }: { url: string; title: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      path: "M13.5 9H15V6.5h-1.85C11.1 6.5 10 7.6 10 9.65V11H8.5v2.5H10V20h2.5v-6.5h1.85l.4-2.5h-2.25V9.9c0-.6.2-.9.85-.9Z",
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      path: "M4 4l7.1 9.2L4.2 20h1.9l6-6.6 4.6 6.6H20l-7.4-9.6L19.1 4h-1.9l-5.6 6.1L7 4H4Z",
    },
    {
      label: "Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
      path: "M12 3a9 9 0 0 0-3.28 17.38c-.05-.72-.09-1.83.02-2.62.1-.7.66-4.48.66-4.48s-.17-.34-.17-.83c0-.78.45-1.36 1.02-1.36.48 0 .71.36.71.79 0 .48-.31 1.2-.46 1.87-.13.56.28 1.02.83 1.02 1 0 1.76-1.05 1.76-2.57 0-1.35-.97-2.29-2.35-2.29-1.6 0-2.54 1.2-2.54 2.44 0 .48.18.99.42 1.27.05.06.05.11.04.17l-.16.63c-.02.1-.08.13-.19.08-.7-.32-1.13-1.34-1.13-2.16 0-1.76 1.28-3.38 3.69-3.38 1.94 0 3.44 1.38 3.44 3.23 0 1.93-1.21 3.48-2.9 3.48-.57 0-1.1-.3-1.28-.64l-.35 1.32c-.13.48-.47 1.09-.7 1.46A9 9 0 1 0 12 3Z",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.label}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-ink hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d={link.path} />
          </svg>
        </a>
      ))}
    </div>
  );
}
