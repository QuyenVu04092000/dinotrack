export const dynamic = "error";

export default function OfflinePage() {
  return (
    <section aria-label="Offline notice" className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-lg font-semibold">You&apos;re offline</h1>
      <p className="mt-2 max-w-xs text-sm text-mutedForeground">
        It seems you have lost your internet connection. You can continue viewing previously loaded content, and new
        data will load once you are back online.
      </p>
    </section>
  );
}
