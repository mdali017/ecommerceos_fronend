"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-gray-600">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-xl bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}
