import { DashboardSkeleton } from "../../components/skeletons";

export default function Loading() {
  return (
    <main className="page-shell">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">Dashboard</h1>
        <p className="mt-2 text-sm text-slate">Loading your applications and profile...</p>
      </div>
      <DashboardSkeleton />
    </main>
  );
}
