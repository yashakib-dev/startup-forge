import Link from "next/link";

const NotFoundPage = () => {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6 py-16">
      <div className="max-w-3xl rounded-[2rem] border border-zinc-800 bg-zinc-900/90 p-8 shadow-[0_25px_80px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="relative mx-auto h-56 w-56 overflow-hidden rounded-full bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-500/10 p-6 shadow-lg shadow-blue-500/10">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_35%)]" />
            <div className="relative flex h-full w-full items-center justify-center">
              <svg viewBox="0 0 160 160" className="h-32 w-32 text-blue-400 opacity-90">
                <circle cx="80" cy="80" r="72" fill="none" stroke="currentColor" strokeWidth="10" opacity="0.18" />
                <rect x="40" y="40" width="80" height="80" rx="20" fill="currentColor" opacity="0.08" />
                <path d="M60 60 L100 100 M100 60 L60 100" stroke="currentColor" strokeWidth="10" strokeLinecap="round" opacity="0.9" />
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-blue-400">Error 404</p>
            <h1 className="text-4xl font-extrabold sm:text-5xl">Page Not Found</h1>
            <p className="mx-auto max-w-2xl text-base leading-7 text-zinc-400">
              The route you followed may have been removed or is temporarily unavailable. Let’s get you back to the forge and explore the latest startup opportunities.
            </p>
          </div>

          <Link href="/" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-[0_15px_40px_rgba(59,130,246,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(59,130,246,0.35)]">
            Back Home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
