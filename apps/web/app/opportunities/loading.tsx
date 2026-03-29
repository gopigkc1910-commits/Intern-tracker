import { OpportunitiesLoadingSkeleton } from "../../components/skeletons";

export default function Loading() {
  return (
    <main className="page-shell">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Opportunities</h1>
          <p className="mt-2 text-sm text-slate">Loading top opportunities for you...</p>
        </div>
      </div>
      <section className="glass-panel min-h-[500px] rounded-[32px] p-6 shadow-glow sm:p-8">
        <OpportunitiesLoadingSkeleton />
      </section>
    </main>
  );
}
