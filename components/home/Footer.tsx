import type { Dictionary } from "@/lib/i18n/types";

export function Footer({ dictionary }: { dictionary: Dictionary }) {
  return (
    <footer className="bg-white">
      <div className="border-t border-brand-border">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green">
                <span className="text-lg">🌿</span>
              </div>
              <span className="text-lg font-bold">
                <span className="text-brand-green">Khaas</span>
                <span className="text-brand-orange"> Food</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">{dictionary.footer.about}</p>
            <p className="mt-3 text-sm text-gray-600">
              📞 ০১৭১২-৩৪৫৬৭৮
              <br />
              ✉️ support@khaasfood.com
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase text-gray-900">
              {dictionary.footer.info}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {dictionary.footer.infoLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="transition-colors hover:text-brand-orange">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase text-gray-900">
              {dictionary.footer.customerService}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {dictionary.footer.serviceLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="transition-colors hover:text-brand-orange">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase text-gray-900">
              {dictionary.footer.myAccount}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {dictionary.footer.accountLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="transition-colors hover:text-brand-orange">
                    {link}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold text-gray-700">
                {dictionary.footer.appDownload}
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="#"
                  className="rounded-lg border border-brand-border bg-black px-3 py-2 text-center text-xs font-medium text-white"
                >
                  Google Play
                </a>
                <a
                  href="#"
                  className="rounded-lg border border-brand-border bg-black px-3 py-2 text-center text-xs font-medium text-white"
                >
                  App Store
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-border bg-brand-gray">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {["Visa", "Mastercard", "bKash", "Nagad", "Rocket"].map((pay) => (
              <span
                key={pay}
                className="rounded border border-brand-border bg-white px-2.5 py-1 text-[10px] font-semibold text-gray-600 sm:text-xs"
              >
                {pay}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {["Facebook", "Instagram", "YouTube"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs font-medium text-gray-500 transition-colors hover:text-brand-orange sm:text-sm"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        <p className="pb-5 text-center text-xs text-gray-500">{dictionary.footer.copyright}</p>
      </div>
    </footer>
  );
}
