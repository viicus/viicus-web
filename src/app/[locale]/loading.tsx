export default function Loading() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center"
      style={{ background: "var(--hero-bg)" }}
    >
      <div className="flex flex-col items-center gap-6 animate-pulse">
        {/* Badge skeleton */}
        <div
          className="h-8 w-36 rounded-full"
          style={{ background: "rgba(var(--accent-rgb),0.08)" }}
        />

        {/* Title skeleton */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-12 w-72 sm:h-16 sm:w-96 rounded-xl"
            style={{ background: "rgba(var(--text-rgb),0.05)" }}
          />
          <div
            className="h-12 w-60 sm:h-16 sm:w-80 rounded-xl"
            style={{ background: "rgba(var(--text-rgb),0.04)" }}
          />
        </div>

        {/* Subtitle skeleton */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <div
            className="h-4 w-80 rounded-lg"
            style={{ background: "rgba(var(--text-rgb),0.04)" }}
          />
          <div
            className="h-4 w-64 rounded-lg"
            style={{ background: "rgba(var(--text-rgb),0.03)" }}
          />
        </div>

        {/* CTA skeleton */}
        <div className="flex gap-4 mt-4">
          <div
            className="h-11 w-36 rounded-full"
            style={{ background: "rgba(var(--accent-rgb),0.15)" }}
          />
          <div
            className="h-11 w-36 rounded-full"
            style={{ background: "rgba(var(--text-rgb),0.05)" }}
          />
        </div>
      </div>
    </main>
  );
}
