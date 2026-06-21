/**
 * scripts/buildRagIndex.js
 *
 * One-time script: run locally with `npm run build:rag`
 *
 * What it does:
 *   1. Extracts text from three sources:
 *        • src/data/portfolio.js      (site content)
 *        • src/data/kronos_report.md  (KronoX project deep-dive)
 *        • src/data/Cuemath_Studio_Full_Report.docx  (Cuemath project deep-dive)
 *   2. Chunks every source into ~300-token segments with ~50-token overlap
 *   3. Generates a 384-dimensional embedding for every chunk using
 *      Xenova/all-MiniLM-L6-v2 (via @xenova/transformers, runs entirely
 *      in Node — no API key needed, model ~23 MB downloaded once to
 *      ~/.cache/huggingface on first run)
 *   4. Writes the result to src/data/ragIndex.json as:
 *      [{ id, text, source, embedding: number[] }, ...]
 *
 * WHY this embedding model?
 *   • Groq has no embeddings API.
 *   • @xenova/transformers + all-MiniLM-L6-v2 is a popular, fast, free
 *     sentence-transformer that produces high-quality semantic embeddings
 *     for retrieval tasks. It runs fully locally — zero cloud cost, zero
 *     API key, deterministic results.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── 1. TEXT EXTRACTION ──────────────────────────────────────────────────────

/**
 * Serialize the portfolio.js data exports into plain text paragraphs.
 * We dynamic-import it so changes to portfolio.js are automatically picked up.
 */
async function extractPortfolio() {
  const {
    PROFILE,
    ABOUT,
    PROJECTS,
    EXPERIENCE,
    SKILLS,
    CERTIFICATES,
  } = await import('../src/data/portfolio.js');

  const lines = [];

  // Profile
  lines.push(`Name: ${PROFILE.name}`);
  lines.push(`Role: ${PROFILE.tagline}`);
  lines.push(`Location: ${PROFILE.location}`);
  lines.push(`Email: ${PROFILE.email}`);
  lines.push(`GitHub: ${PROFILE.github}`);
  lines.push(`LinkedIn: ${PROFILE.linkedin}`);
  lines.push(`Portfolio: ${PROFILE.portfolio}`);

  lines.push('');

  // About
  lines.push(`About — ${ABOUT.heading}`);
  ABOUT.paragraphs.forEach(p => lines.push(p));
  ABOUT.stats.forEach(s => lines.push(`${s.label}: ${s.value}${s.sub}`));

  lines.push('');

  // Projects
  PROJECTS.forEach(p => {
    lines.push(`Project: ${p.title} — ${p.subtitle}`);
    lines.push(p.blurb);
    if (p.impact) lines.push(`Impact: ${p.impact}`);
    lines.push(`Tech stack: ${p.stack.join(', ')}`);
    if (p.github) lines.push(`Source code: ${p.github}`);
    if (p.live)   lines.push(`Live demo: ${p.live}`);
    lines.push('');
  });

  // Experience
  EXPERIENCE.forEach(e => {
    lines.push(`Experience: ${e.role} at ${e.org} (${e.period})`);
    e.bullets.forEach(b => lines.push(`  • ${b}`));
    lines.push('');
  });

  // Skills
  SKILLS.forEach(s => {
    lines.push(
      `Skills — ${s.category}: ${s.items.map(i => `${i.name} (${i.level}%)`).join(', ')}`
    );
  });

  lines.push('');

  // Certificates
  lines.push('Certifications:');
  CERTIFICATES.forEach(c => lines.push(`  • ${c.name} — ${c.issuer}`));

  return lines.join('\n');
}

/** Read a Markdown file as plain text. */
async function extractMarkdown(filePath) {
  return fs.readFile(filePath, 'utf-8');
}

/** Extract raw text from a .docx file using mammoth. */
async function extractDocx(filePath) {
  const mammoth = (await import('mammoth')).default ?? (await import('mammoth'));
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

// ─── 2. CHUNKING ──────────────────────────────────────────────────────────────

/**
 * Split `text` into overlapping chunks of ~maxChars characters.
 *
 * Strategy:
 *   - Split on double newlines (paragraphs / sections) first.
 *   - Accumulate paragraphs into a buffer up to maxChars.
 *   - When the buffer is full, emit it as a chunk and start the next
 *     buffer with the last `overlapChars` characters (overlap).
 *   - If a single paragraph exceeds maxChars, split it on sentence
 *     boundaries instead.
 *
 * Token estimate: ~4 chars per English token.
 * Default target: 300 tokens → 1200 chars; overlap: 50 tokens → 200 chars.
 */
function chunkText(text, source, maxTokens = 300, overlapTokens = 50) {
  const maxChars     = maxTokens * 4;
  const overlapChars = overlapTokens * 4;

  const paragraphs = text
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(p => p.length > 20); // drop near-empty lines

  const chunks = [];
  let buffer = '';

  const flush = () => {
    if (buffer.trim().length > 0) {
      chunks.push(buffer.trim());
    }
  };

  for (const para of paragraphs) {
    const candidate = buffer ? buffer + '\n\n' + para : para;

    if (candidate.length <= maxChars) {
      buffer = candidate;
    } else {
      flush();
      // Start new buffer with overlap
      const overlap = buffer.slice(-overlapChars);
      buffer = overlap ? overlap + '\n\n' + para : para;

      // If even a single para is too long, split on sentences
      if (buffer.length > maxChars) {
        const sentences = buffer.match(/[^.!?\n]+[.!?\n]+/g) ?? [buffer];
        buffer = '';
        for (const sent of sentences) {
          const next = buffer ? buffer + ' ' + sent : sent;
          if (next.length <= maxChars) {
            buffer = next;
          } else {
            flush();
            buffer = sent.slice(0, maxChars); // hard cap on runaway sentences
          }
        }
      }
    }
  }
  flush();

  return chunks.map((text, i) => ({
    id: `${source}-${i}`,
    text,
    source,
  }));
}

// ─── 3. EMBEDDINGS ────────────────────────────────────────────────────────────

/**
 * Generate sentence embeddings for an array of strings.
 *
 * Model: Xenova/all-MiniLM-L6-v2 (quantized ONNX)
 *   - 384-dimensional output
 *   - Mean-pooled + L2-normalized (cosine similarity = dot product)
 *   - ~23 MB download on first run, cached locally afterward
 */
async function generateEmbeddings(texts) {
  console.log('   Loading Xenova/all-MiniLM-L6-v2 (downloads ~23 MB on first run)…');
  const { pipeline } = await import('@xenova/transformers');

  const extractor = await pipeline(
    'feature-extraction',
    'Xenova/all-MiniLM-L6-v2',
    { quantized: true }
  );

  const embeddings = [];
  for (let i = 0; i < texts.length; i++) {
    process.stdout.write(`\r   Embedding chunk ${i + 1} / ${texts.length}  `);
    const output = await extractor(texts[i], { pooling: 'mean', normalize: true });
    embeddings.push(Array.from(output.data));
  }
  process.stdout.write('\n');

  return embeddings;
}

// ─── 4. MAIN ─────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔍  Extracting source content…');

  const sources = [
    {
      name: 'portfolio',
      getText: () => extractPortfolio(),
    },
    {
      name: 'kronos',
      getText: () => extractMarkdown(path.join(ROOT, 'src/data/kronos_report.md')),
    },
    {
      name: 'cuemath',
      getText: () => extractDocx(path.join(ROOT, 'src/data/Cuemath_Studio_Full_Report.docx')),
    },
  ];

  const allChunks = [];

  for (const { name, getText } of sources) {
    process.stdout.write(`   • ${name}… `);
    const text = await getText();
    const chunks = chunkText(text, name);
    allChunks.push(...chunks);
    console.log(`${chunks.length} chunks`);
  }

  console.log(`\n✂️   Total chunks: ${allChunks.length}`);
  console.log('\n🧠  Generating embeddings…');

  const texts = allChunks.map(c => c.text);
  const embeddings = await generateEmbeddings(texts);

  const index = allChunks.map((chunk, i) => ({
    ...chunk,
    embedding: embeddings[i],
  }));

  const outPath = path.join(ROOT, 'src/data/ragIndex.json');
  await fs.writeFile(outPath, JSON.stringify(index), 'utf-8');

  const fileSizeKB = Math.round((await fs.stat(outPath)).size / 1024);
  console.log(`\n✅  Wrote ${index.length} chunks → src/data/ragIndex.json (${fileSizeKB} KB)`);
  console.log('\nDone! Commit src/data/ragIndex.json to your repo.\n');
}

main().catch(err => {
  console.error('\n❌  Build failed:', err);
  process.exit(1);
});
