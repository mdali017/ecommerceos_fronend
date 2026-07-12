"use client";

import { useLocale } from "@/components/providers/LocaleProvider";

export function FloatingWidgets() {
  const { localizePath, dictionary } = useLocale();

  return (
    <>
      <a
        href={localizePath("/checkout")}
        className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 rounded-l-lg bg-brand-orange px-2 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-colors hover:bg-brand-orange-dark [writing-mode:vertical-rl] sm:block"
      >
        {dictionary.pages.checkout}
      </a>

      <button
        type="button"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange text-white shadow-xl transition-transform hover:scale-105 hover:bg-brand-orange-dark"
        aria-label="Chat"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    </>
  );
}
