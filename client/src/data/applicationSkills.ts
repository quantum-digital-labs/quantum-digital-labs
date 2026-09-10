import { INTERNSHIPS } from './internships';
import { JOBS } from './jobs';

export const APPLICATION_SKILL_OTHER = 'Other';

/** Unique technical skills taken from job and internship openings. */
export function getApplicationSkillOptions(preferred: string[] = []): string[] {
  const all = new Set<string>();
  for (const job of JOBS) {
    for (const skill of job.skills) all.add(skill);
  }
  for (const item of INTERNSHIPS) {
    for (const skill of item.technologies) all.add(skill);
  }

  const seen = new Set<string>();
  const ordered: string[] = [];

  for (const skill of preferred) {
    const label = skill.trim();
    if (!label || seen.has(label)) continue;
    seen.add(label);
    ordered.push(label);
    all.add(label);
  }

  for (const skill of [...all].sort((a, b) => a.localeCompare(b))) {
    if (seen.has(skill) || skill === APPLICATION_SKILL_OTHER) continue;
    seen.add(skill);
    ordered.push(skill);
  }

  ordered.push(APPLICATION_SKILL_OTHER);
  return ordered;
}
