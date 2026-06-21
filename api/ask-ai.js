/**
 * api/ask-ai.js  —  Vercel Serverless Function (Node.js, ESM)
 *
 * POST /api/ask-ai
 * Body: { "question": "string" }
 * Returns: { "answer": "string" } | { "error": "string" }
 *
 * Pipeline:
 *   1. Embed the user's question with Xenova/all-MiniLM-L6-v2
 *      (same model used by scripts/buildRagIndex.js)
 *   2. Load src/data/ragIndex.json (pre-built, committed to repo)
 *   3. Compute cosine similarity between the query embedding and every
 *      chunk embedding — take the top 5 chunks as context
 *   4. Send context + question to Groq's chat completion API
 *   5. Return the answer
 *
 * Environment variable required (set in Vercel dashboard):
 *   GROQ_API_KEY — never exposed to the frontend
 *
 * Cold-start note:
 *   The first request after a cold start downloads the ~23 MB ONNX model
 *   from Hugging Face into /tmp. Subsequent warm requests reuse the
 *   module-level cached pipeline (~<1 s). vercel.json sets maxDuration: 30
 *   to give cold starts enough headroom.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// ─── Module-level singletons (warm across invocations) ───────────────────────

/** @type {Array<{id:string, text:string, source:string, embedding:number[]}>} */
const ragIndex = JSON.parse(
  readFileSync(join(__dirname, '../src/data/ragIndex.json'), 'utf-8')
);

/** Lazy-loaded embedding pipeline — cached after first cold start */
let _embedPipeline = null;

async function getEmbedPipeline() {
  if (!_embedPipeline) {
    // Point the transformers cache to /tmp so it persists across warm invocations
    process.env.TRANSFORMERS_CACHE = '/tmp/transformers_cache';

    const { pipeline } = await import('@xenova/transformers');
    _embedPipeline = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
      { quantized: true }
    );
  }
  return _embedPipeline;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Cosine similarity between two equal-length float arrays.
 * Both vectors are L2-normalized (done by the embedding model),
 * so this is equivalent to a dot product — kept explicit for clarity.
 */
function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot   += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Embed a single string and return the raw float array.
 */
async function embedQuery(text, pipe) {
  const output = await pipe(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // CORS for local dev (Vite proxy will handle production)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const question = (req.body?.question ?? '').trim();
  if (!question) {
    return res.status(400).json({ error: 'Missing question' });
  }
  if (question.length > 500) {
    return res.status(400).json({ error: 'Question too long (max 500 chars)' });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    console.error('GROQ_API_KEY not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // 1 ─ Embed the question
    const pipe       = await getEmbedPipeline();
    const queryVec   = await embedQuery(question, pipe);

    // 2 ─ Cosine similarity retrieval — top 5 chunks
    const scored = ragIndex
      .map(chunk => ({ ...chunk, score: cosineSimilarity(queryVec, chunk.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // 3 ─ Build context string
    const context = scored
      .map((c, i) => `[${i + 1}] Source: ${c.source}\n${c.text}`)
      .join('\n\n---\n\n');

    // 4 ─ Groq chat completion
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        temperature: 0.2,
        max_tokens: 450,
        messages: [
          {
            role: 'system',
            content: [
              'You are Muskan Kumari — a Generative AI Engineer and AI Agent Developer.',
              'Speak in first person as Muskan herself, naturally and confidently, like you\'re chatting with someone curious about your work.',
              'Answer questions about your projects, skills, experience, and background using ONLY the context below.',
              'Never say "based on my context" or "according to my data" — just speak as yourself.',
              'Keep answers concise and warm. If something isn\'t covered, say: "I haven\'t detailed that here — reach out at muskankumari14373@gmail.com!"',
              '',
              'Context:',
              context,
            ].join('\n'),
          },
          {
            role: 'user',
            content: question,
          },
        ],
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error('Groq API error:', groqResponse.status, errText);
      return res.status(502).json({ error: 'AI service error. Please try again.' });
    }

    const groqData = await groqResponse.json();
    const answer   = groqData.choices?.[0]?.message?.content?.trim() ?? 'No response.';

    return res.status(200).json({ answer });
  } catch (err) {
    console.error('ask-ai handler error:', err);
    return res.status(500).json({ error: 'Internal error. Please try again.' });
  }
}
