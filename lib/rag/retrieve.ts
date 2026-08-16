import { knowledgeBase, type KnowledgeDoc } from "./knowledge";

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "of", "in", "on", "at", "to", "for", "and", "or", "but", "with",
  "what", "who", "whom", "which", "how", "why", "do", "does", "did",
  "you", "your", "he", "his", "him", "it", "its", "this", "that",
  "i", "me", "my", "about", "tell", "can", "could", "would", "should",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s.]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

// Precompute doc term frequencies once at module load.
const docTerms: { doc: KnowledgeDoc; terms: Map<string, number> }[] = knowledgeBase.map(
  (doc) => {
    const terms = new Map<string, number>();
    for (const t of tokenize(`${doc.title} ${doc.text}`)) {
      terms.set(t, (terms.get(t) ?? 0) + 1);
    }
    return { doc, terms };
  }
);

const docFreq = new Map<string, number>();
for (const { terms } of docTerms) {
  for (const term of terms.keys()) {
    docFreq.set(term, (docFreq.get(term) ?? 0) + 1);
  }
}
const N = docTerms.length;

function idf(term: string): number {
  const df = docFreq.get(term) ?? 0;
  return Math.log((N + 1) / (df + 1)) + 1;
}

/** Lightweight TF-IDF keyword retriever — no embedding API needed for a corpus this small. */
export function retrieve(query: string, topK = 4): KnowledgeDoc[] {
  const queryTerms = tokenize(query);
  if (queryTerms.length === 0) {
    return knowledgeBase.slice(0, topK);
  }

  const scored = docTerms.map(({ doc, terms }) => {
    let score = 0;
    for (const qt of queryTerms) {
      const tf = terms.get(qt) ?? 0;
      if (tf > 0) score += tf * idf(qt);
    }
    return { doc, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const withHits = scored.filter((s) => s.score > 0);
  if (withHits.length === 0) {
    return [
      knowledgeBase.find((d) => d.id === "bio")!,
      knowledgeBase.find((d) => d.id === "stack")!,
      knowledgeBase.find((d) => d.id === "contact")!,
    ];
  }
  return withHits.slice(0, topK).map((s) => s.doc);
}
