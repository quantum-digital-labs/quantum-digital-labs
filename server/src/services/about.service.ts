import { getPool } from '../db/pool';
import { AppError } from '../utils/AppError';
import { asStringArray, type JsonObject } from '../utils/cmsHelpers';

interface AboutRow {
  vision: string;
  mission: string;
  why_choose: string[] | null;
  journey_titles: string[] | null;
  journey_texts: string[] | null;
  value_titles: string[] | null;
  value_descriptions: string[] | null;
  value_accents: string[] | null;
}

const ABOUT_SELECT = `
  vision, mission, why_choose,
  journey_titles, journey_texts,
  value_titles, value_descriptions, value_accents
`;

function mapAboutRow(row: AboutRow): JsonObject {
  const journeyTitles = row.journey_titles ?? [];
  const journeyTexts = row.journey_texts ?? [];
  const journeyLen = Math.max(journeyTitles.length, journeyTexts.length);
  const journey: { title: string; text: string }[] = [];
  for (let i = 0; i < journeyLen; i++) {
    const title = String(journeyTitles[i] ?? '').trim();
    const text = String(journeyTexts[i] ?? '').trim();
    if (title || text) journey.push({ title, text });
  }

  const valueTitles = row.value_titles ?? [];
  const valueDescriptions = row.value_descriptions ?? [];
  const valueAccents = row.value_accents ?? [];
  const valuesLen = Math.max(
    valueTitles.length,
    valueDescriptions.length,
    valueAccents.length,
  );
  const values: { title: string; description: string; accent?: string }[] = [];
  for (let i = 0; i < valuesLen; i++) {
    const title = String(valueTitles[i] ?? '').trim();
    const description = String(valueDescriptions[i] ?? '').trim();
    const accent = String(valueAccents[i] ?? '').trim();
    if (!title && !description && !accent) continue;
    values.push({
      title,
      description,
      ...(accent ? { accent } : {}),
    });
  }

  return {
    vision: row.vision ?? '',
    mission: row.mission ?? '',
    whyChoose: row.why_choose ?? [],
    journey,
    values,
  };
}

function unpackJourney(body: JsonObject): {
  titles: string[];
  texts: string[];
} {
  const journey = Array.isArray(body.journey) ? body.journey : [];
  const titles: string[] = [];
  const texts: string[] = [];
  for (const item of journey) {
    if (!item || typeof item !== 'object') continue;
    const row = item as { title?: unknown; text?: unknown };
    titles.push(String(row.title ?? '').trim());
    texts.push(String(row.text ?? '').trim());
  }
  return { titles, texts };
}

function unpackValues(body: JsonObject): {
  titles: string[];
  descriptions: string[];
  accents: string[];
} {
  const values = Array.isArray(body.values) ? body.values : [];
  const titles: string[] = [];
  const descriptions: string[] = [];
  const accents: string[] = [];
  for (const item of values) {
    if (!item || typeof item !== 'object') continue;
    const row = item as {
      title?: unknown;
      description?: unknown;
      accent?: unknown;
    };
    titles.push(String(row.title ?? '').trim());
    descriptions.push(String(row.description ?? '').trim());
    accents.push(String(row.accent ?? '').trim());
  }
  return { titles, descriptions, accents };
}

export async function getAbout(): Promise<JsonObject> {
  const pool = getPool();
  const result = await pool.query<AboutRow>(
    `SELECT ${ABOUT_SELECT} FROM about_content WHERE id = 'main'`,
  );
  if (!result.rows[0]) {
    throw new AppError('About content not found', 404);
  }
  return mapAboutRow(result.rows[0]);
}

export async function putAbout(data: JsonObject): Promise<JsonObject> {
  const pool = getPool();
  const journey = unpackJourney(data);
  const values = unpackValues(data);

  const result = await pool.query<AboutRow>(
    `INSERT INTO about_content (
       id, data, vision, mission, why_choose,
       journey_titles, journey_texts,
       value_titles, value_descriptions, value_accents, updated_at
     ) VALUES (
       'main', '{}'::jsonb, $1, $2, $3,
       $4, $5,
       $6, $7, $8, NOW()
     )
     ON CONFLICT (id) DO UPDATE SET
       data = '{}'::jsonb,
       vision = EXCLUDED.vision,
       mission = EXCLUDED.mission,
       why_choose = EXCLUDED.why_choose,
       journey_titles = EXCLUDED.journey_titles,
       journey_texts = EXCLUDED.journey_texts,
       value_titles = EXCLUDED.value_titles,
       value_descriptions = EXCLUDED.value_descriptions,
       value_accents = EXCLUDED.value_accents,
       updated_at = NOW()
     RETURNING ${ABOUT_SELECT}`,
    [
      String(data.vision ?? ''),
      String(data.mission ?? ''),
      asStringArray(data.whyChoose),
      journey.titles,
      journey.texts,
      values.titles,
      values.descriptions,
      values.accents,
    ],
  );
  return mapAboutRow(result.rows[0]!);
}
