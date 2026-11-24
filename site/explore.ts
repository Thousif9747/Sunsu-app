import { products } from './sunsu';

export const exploration = {
  mango: { word: 'MANGO', note: 'Mango and banana meet cocoa and dates.', accent: '#f2b741', mood: 'SUNNY / FRUIT & COCOA' },
  berry: { word: 'BERRY', note: 'Strawberry, hibiscus and lemon notes.', accent: '#ed8daf', mood: 'BRIGHT / FRUIT & BOTANICAL' },
  digest: { word: 'PAPAYA', note: 'Papaya with ginger, lemon and mint.', accent: '#b8d17b', mood: 'ZINGY / FRUIT & HERBS' },
  pineapple: { word: 'PINEAPPLE', note: 'A tropical pairing of pineapple and coconut.', accent: '#eecf69', mood: 'TROPICAL / PINEAPPLE & COCONUT' },
  choco: { word: 'COCOA', note: 'Cocoa, banana, dates and coconut notes.', accent: '#d6ad88', mood: 'COCOA / FRUIT & COCONUT' },
  nannari: { word: 'NANNARI', note: 'Nannari and khus with citrus and spice.', accent: '#99caa2', mood: 'HERITAGE / ROOTS & BOTANICALS' },
} as const;

export function flavourInfo(id: string) {
  return exploration[id as keyof typeof exploration] ?? exploration.mango;
}

export type ExplorerProgress = { version: 1; best: Record<string, number>; explored: string[] };
export const emptyProgress = (): ExplorerProgress => ({ version: 1, best: {}, explored: [] });
export function cleanProgress(value: unknown): ExplorerProgress {
  const clean = emptyProgress();
  if (!value || typeof value !== 'object' || Array.isArray(value)) return clean;
  const raw = value as Partial<ExplorerProgress>;
  if (raw.version !== 1) return clean;
  for (const product of products) {
    const score = raw.best && typeof raw.best === 'object' ? raw.best[product.id] : undefined;
    if (typeof score === 'number' && Number.isInteger(score) && score >= 0 && score <= 3) clean.best[product.id] = score;
    if (Array.isArray(raw.explored) && raw.explored.includes(product.id)) clean.explored.push(product.id);
  }
  return clean;
}
export function completeFlavour(progress: ExplorerProgress, id: string, score: number): ExplorerProgress {
  const clean = cleanProgress(progress);
  if (!products.some(product => product.id === id) || !Number.isInteger(score) || score < 0 || score > 3) return clean;
  clean.best[id] = Math.max(clean.best[id] ?? 0, score);
  if (!clean.explored.includes(id)) clean.explored.push(id);
  return clean;
}

export type IngredientRound = { answer: string; choices: string[] };
export function ingredientRounds(id: string, seed = 1): IngredientRound[] {
  const product = products.find(item => item.id === id);
  if (!product) return [];
  const ingredients = product.ingredients.split(' · ');
  const other = Array.from(new Set(products.flatMap(item => item.ingredients.split(' · '))))
    .filter(item => !ingredients.some(ingredient => {
      const own = ingredient.toLowerCase(), other = item.toLowerCase();
      return own.includes(other) || other.includes(own);
    }));
  let state = (Number.isFinite(seed) ? Math.abs(Math.floor(seed)) : 1) % 2147483647 || 1;
  const shuffle = <T,>(list: T[]) => {
    const result = [...list];
    for (let i = result.length - 1; i > 0; i--) {
      state = state * 48271 % 2147483647;
      const j = state % (i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };
  const correct = shuffle(ingredients);
  return Array.from({ length: 3 }, (_, index) => {
    const answer = correct[index % correct.length];
    return { answer, choices: shuffle([answer, ...shuffle(other).slice(0, 2)]) };
  });
}

export function publicSiteBase(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') return null;
    const host = url.hostname.toLowerCase();
    if (!host.includes('.') || host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.test') || host.endsWith('.invalid') || host.endsWith('.example') || /^[\d.]+$/.test(host) || host.includes(':')) return null;
    return url.origin;
  } catch { return null; }
}
export const canonicalPlayUrl = (id: string) => {
  const base = publicSiteBase(process.env.NEXT_PUBLIC_SITE_URL);
  return base && products.some(product => product.id === id) ? `${base}/play/${id}` : undefined;
};
