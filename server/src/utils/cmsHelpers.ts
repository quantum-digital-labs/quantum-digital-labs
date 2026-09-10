import type { Request } from 'express';

export type JsonObject = Record<string, unknown>;

export interface ContentRow {
  id: string;
  uuid?: string;
  title: string;
  published: boolean;
  data: JsonObject;
}

export function asObject(data: unknown): JsonObject {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return data as JsonObject;
  }
  return {};
}

export function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item)).filter(Boolean);
}

export function asOptionalInt(value: unknown): number | null {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  return Number.isInteger(n) ? n : null;
}

export function asOptionalDate(value: unknown): string | null {
  if (value === undefined || value === null || value === '') return null;
  const text = String(value).trim();
  if (!/^\d{4}-\d{2}-\d{2}/.test(text)) return null;
  return text.slice(0, 10);
}

export function asOptionalText(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text ? text : null;
}

export function formatDateField(
  value: string | Date | null | undefined,
): string | undefined {
  if (value == null || value === '') return undefined;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

export function asFaqs(value: unknown): { question: string; answer: string }[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as { question?: unknown; answer?: unknown };
      const question = String(row.question ?? '').trim();
      const answer = String(row.answer ?? '').trim();
      if (!question && !answer) return null;
      return { question, answer };
    })
    .filter((item): item is { question: string; answer: string } => item !== null);
}

export function faqsToColumns(
  faqs: { question: string; answer: string }[],
): { questions: string[]; answers: string[] } {
  return {
    questions: faqs.map((f) => f.question),
    answers: faqs.map((f) => f.answer),
  };
}

export function columnsToFaqs(
  questions: string[] | null | undefined,
  answers: string[] | null | undefined,
): { question: string; answer: string }[] {
  const q = questions ?? [];
  const a = answers ?? [];
  const len = Math.max(q.length, a.length);
  const out: { question: string; answer: string }[] = [];
  for (let i = 0; i < len; i++) {
    const question = String(q[i] ?? '').trim();
    const answer = String(a[i] ?? '').trim();
    if (question || answer) out.push({ question, answer });
  }
  return out;
}

export function metricsToColumn(metrics: unknown): string[] {
  if (!Array.isArray(metrics)) return [];
  return metrics
    .map((item) => {
      if (!item || typeof item !== 'object') return '';
      const row = item as { label?: unknown; value?: unknown };
      const label = String(row.label ?? '').trim();
      const value = String(row.value ?? '').trim();
      if (!label && !value) return '';
      return `${label} | ${value}`;
    })
    .filter(Boolean);
}

export function columnToMetrics(
  values: string[] | null | undefined,
): { label: string; value: string }[] {
  return (values ?? [])
    .map((line) => {
      const text = String(line);
      const idx = text.indexOf('|');
      if (idx === -1) return { label: text.trim(), value: '' };
      return {
        label: text.slice(0, idx).trim(),
        value: text.slice(idx + 1).trim(),
      };
    })
    .filter((m) => m.label || m.value);
}

export function zipParallel(
  titles: string[] | null | undefined,
  texts: string[] | null | undefined,
  keyA: 'title' | 'label',
  keyB: 'text' | 'description',
): Record<string, string>[] {
  const a = titles ?? [];
  const b = texts ?? [];
  const len = Math.max(a.length, b.length);
  const out: Record<string, string>[] = [];
  for (let i = 0; i < len; i++) {
    const left = String(a[i] ?? '').trim();
    const right = String(b[i] ?? '').trim();
    if (!left && !right) continue;
    out.push({ [keyA]: left, [keyB]: right });
  }
  return out;
}

export function mapContentRow(row: ContentRow): JsonObject {
  const data = asObject(row.data);
  return {
    ...data,
    id: (data.id as string | undefined) ?? row.id,
    uuid: row.uuid ?? (data.uuid as string | undefined),
    title: (data.title as string | undefined) ?? row.title,
    published: row.published,
  };
}

export function isUniqueViolation(error: unknown): boolean {
  return (
    !!error &&
    typeof error === 'object' &&
    'code' in error &&
    (error as { code: string }).code === '23505'
  );
}

export function isStaff(req: Request): boolean {
  const role = req.user?.role;
  return role === 'admin' || role === 'editor';
}

export function listOpts(req: Request) {
  return { includeUnpublished: isStaff(req) };
}
