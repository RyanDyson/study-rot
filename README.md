# StudyRot

> **Doomscroll your way to an A.**

Turn any course syllabus, lecture slides, or PDF into a bingeable Twitter-style thread — explained by chronically online AI characters with full gen-z brainrot energy. Same doom-scrolling habit, actual knowledge.

---

## What It Does

1. **Upload** your course material (PDF, DOCX, PPT, images) into a private knowledge base.
2. **OCR & extract** — Tesseract.js reads the raw text out of every page.
3. **Generate** — the AI breaks the content into a Twitter-style thread where fake accounts argue, correct each other, drop hot takes, and build up the concept from first principles.
4. **Scroll** — read through the thread like a social media feed. Replies, nested discussions, likes — the whole thing.

---

## Project Story

### Inspiration

Every student has felt it: the lecture slides are open, the textbook is loaded, and yet... somehow the TikTok tab is more compelling. Attention is finite, and traditional studying fights against how our brains actually behave online.

The insight was simple — **don't fight the doom-scroll, weaponize it**. If you can make a concept feel like a Twitter drama unfolding in real time, the same compulsive scrolling behaviour that kills productivity can be redirected into learning.

The name "StudyRot" is a direct reference to "brain rot" — the internet slang for the mental decay caused by too much low-quality content. StudyRot asks: what if the rot *was* the content?

---

### How We Built It

The pipeline works roughly like this:

**1. Ingestion**

Files are uploaded via a multipart form POST to `/api/upload`. They're written to a temporary directory and a record is inserted into the `knowledgeFiles` table with `ocrStatus: "pending"`.

**2. OCR**

Tesseract.js processes each file asynchronously, extracting raw text. For PDFs, `pdfjs-dist` is used to rasterise pages before Tesseract reads them. The extracted text is stored back in the database (`extractedText` column).

**3. Thread Generation**

When a user hits "Generate Thread", the router fetches all completed OCR texts for the knowledge base and feeds them — one document at a time — to a self-hosted LLM endpoint. The prompt instructs the model to return a **strictly valid JSON array** of tweet objects in the shape:

```ts
type Thread = {
  id: string;
  author: string;
  handle: string;
  content: string;
  likes: number;
  replies?: Thread[];
};
```

The system prompt forces the output to be unhinged gen-z brainrot while still being factually grounded in the source material. For example, explaining overfitting might look like:

> **@BasedMLTutor**: bro your model has more rizz for the training data than it does for real life fr fr 💀 that's literally what overfitting is

**4. Rendering**

Threads are rendered as a recursive tweet card tree. Each card shows the author, content, like count, and optionally a list of reply cards. Clicking "View Replies" expands nested discussions.

---

### The Math Behind It

At its core, the thread generation is a **Retrieval-Augmented Generation (RAG)** pattern. Given a document $D$ split into chunks $\{c_1, c_2, \ldots, c_n\}$, for each chunk we compute a context-conditioned generation:

$$T_i = \text{LLM}(p_{\text{system}},\ c_i)$$

where $p_{\text{system}}$ is the brainrot persona prompt and $T_i$ is the resulting thread segment. The final thread is the concatenation:

$$T = T_1 \oplus T_2 \oplus \cdots \oplus T_n$$

The "misconception + correction" format maps naturally to contrastive learning theory — presenting both $h_{\text{wrong}}$ and $h_{\text{correct}}$ with an explicit correction signal has been shown to improve retention compared to only presenting correct information.

---

### Challenges

**Getting the LLM to return strict JSON**

This was the single hardest problem. LLMs — even when told ten times — love to wrap output in markdown code fences (` ```json `), add a preamble sentence, or hallucinate extra fields. The fix was a combination of:
- Extremely explicit negative rules in the system prompt ("No markdown, no code fences, no text before or after the JSON")
- A post-processing strip that removes fences with a regex before `JSON.parse`
- Type assertions on the parsed output to catch shape mismatches early

**OCR quality on low-res slides**

Tesseract performs poorly on compressed lecture slide exports. Preprocessing (contrast boost, binarisation) helped but wasn't perfect. We worked around this by falling back to the raw filename as context when extracted text was too short to be useful.

**Keeping brainrot educational**

The first few prompts produced tweets that were funny but factually hollow. The breakthrough was separating the *persona* (chaotic, extremely online) from the *content constraints* (must teach a real concept, must include a misconception and a correction). Once the model understood it was playing a character *within* a factual constraint, quality improved dramatically.

**tRPC streaming vs regular JSON**

Using `httpBatchStreamLink` caused a `SyntaxError: JSON.parse: unexpected non-whitespace character after JSON data at line 2` error because the NDJSON streaming format was being parsed as a single JSON object somewhere in the Next.js response chain. Switching to `httpBatchLink` resolved it — streaming was unnecessary for these query sizes.

---

## Tech Stack

Next.js, React, TypeScript, Bun, tRPC, TanStack Query, Drizzle ORM, PostgreSQL, Neon, SuperJSON, Better Auth, Resend, LangChain, AWS Bedrock, Tesseract.js, pdf.js, Tailwind CSS, shadcn/ui, Radix UI, Lucide React, Sonner, next-themes, Three.js, React Three Fiber, Zod, ESLint, Prettier, Drizzle Kit

---

## File Structure

```
src/
├── app/
│   ├── (protected)/dashboard/     # Authenticated app shell
│   │   ├── courses/[courses]/     # Course knowledge base page
│   │   ├── threads/[threadId]/    # Thread viewer
│   │   └── layout.tsx             # Navbar + provider layout
│   ├── api/
│   │   ├── auth/[...all]/         # Better Auth catch-all
│   │   ├── upload/                # File ingestion endpoint
│   │   └── trpc/[trpc]/           # tRPC handler
│   └── page.tsx                   # Landing page
├── components/
│   ├── global/                    # Navbar, course cards, upload dialog
│   ├── patterns/                  # File upload table pattern
│   └── ui/                        # shadcn/ui primitives
├── hooks/                         # useFileUpload
├── server/
│   ├── api/router/                # tRPC routers
│   ├── better-auth/               # Auth config + client
│   ├── db/                        # Drizzle schema + client
│   ├── ocr/                       # Tesseract OCR service
│   └── rag/                       # LLM / Bedrock integration
└── trpc/                          # React + server tRPC clients
```

---

## Getting Started

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env

# Push database schema
bun db:push

# Start dev server (port 3100)
bun dev
```

### Required Environment Variables

| Variable | Description |
|---|---|
| `BETTER_AUTH_URL` | Base URL of the app (e.g. `http://localhost:3100`) |
| `BETTER_AUTH_SECRET` | Random secret for session signing |
| `BETTER_AUTH_GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `BETTER_AUTH_GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |
| `DATABASE_URL` | PostgreSQL connection string (Neon recommended) |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `AI_ENDPOINT` | URL of the self-hosted LLM endpoint |

---

## Deployment

Follows standard Next.js deployment. Recommended: **Vercel** for the app, **Neon** for the database.

- [Vercel deployment guide](https://create.t3.gg/en/deployment/vercel)
- [Netlify deployment guide](https://create.t3.gg/en/deployment/netlify)
- [Docker deployment guide](https://create.t3.gg/en/deployment/docker)
