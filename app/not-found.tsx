import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-brand-orange">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-2 text-gray-600">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-brand-green px-6 py-3 text-sm font-semibold text-white"
      >
        Back to store
      </Link>
    </div>
  );
}
