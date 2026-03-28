import type { OpportunityDetail, UserProfile } from "../lib/types";

function calculateMatch(profile: UserProfile | null, opportunity: OpportunityDetail) {
  if (!profile) return null;

  let score = 35;
  const skills = opportunity.required_skills ?? [];
  const skillOverlap = skills.filter((skill) =>
    profile.skills.some((item) => item.toLowerCase() === skill.toLowerCase())
  ).length;
  score += Math.min(skillOverlap * 12, 36);

  if (profile.preferred_domains.some((item) => item.toLowerCase() === opportunity.domain.toLowerCase())) score += 12;
  if (profile.preferred_opportunity_types.some((item) => item.toLowerCase() === opportunity.type.toLowerCase())) score += 10;
  if (profile.preferred_locations.some((item) => item.toLowerCase() === opportunity.mode.toLowerCase())) score += 7;

  return Math.min(score, 100);
}

export function ResumeMatchCard({
  profile,
  opportunity
}: {
  profile: UserProfile | null;
  opportunity: OpportunityDetail;
}) {
  const score = calculateMatch(profile, opportunity);

  return (
    <section className="rounded-3xl border border-white/60 bg-white/90 p-5">
      <h3 className="text-lg font-semibold text-ink">Resume match</h3>
      {score == null ? (
        <p className="mt-2 text-sm leading-6 text-slate">Sign in and complete your profile to see a match score.</p>
      ) : (
        <>
          <div className="mt-4 flex items-end justify-between gap-4">
            <p className="text-4xl font-semibold text-ink">{score}%</p>
            <p className="text-sm text-slate">
              {score >= 80 ? "Strong fit" : score >= 60 ? "Good fit" : "Needs profile tuning"}
            </p>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-mist">
            <div className="h-full rounded-full bg-gradient-to-r from-teal to-coral" style={{ width: `${score}%` }} />
          </div>
          <p className="mt-4 text-sm leading-6 text-slate">
            Match is based on skills, preferred domains, opportunity type, and location preferences.
          </p>
        </>
      )}
    </section>
  );
}
