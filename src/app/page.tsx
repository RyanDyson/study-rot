import Link from "next/link";
import { Navbar } from "@/components/global/navbar";
import { HydrateClient } from "@/trpc/server";
import { Dither } from "@/components/Dither";
import { Sparkles } from "lucide-react";
import { Iphone } from "@/components/ui/iphone";
import { ThreadTweetCard } from "@/app/(protected)/dashboard/threads/[threadId]/thread-tweet-card";
import { type Thread } from "@/server/api/router/threadRouter";

const SAMPLE_THREAD: Thread[] = [
  {
    id: "s1",
    author: "ConceptBot",
    handle: "@ConceptBot",
    content:
      'Hot take: "Overfitting is just your model trying really hard." 🔥',
    likes: 412,
  },
  {
    id: "s2",
    author: "ExplainAI",
    handle: "@ExplainAI",
    content:
      "Not quite. Overfitting means your model memorizes the training data and fails on new data. Let's walk through an example 👇",
    likes: 891,
    replies: [
      {
        id: "s2-r1",
        author: "MythBuster",
        handle: "@MythBuster",
        content:
          'Misconception: "More parameters always = better model." This is where regularization and validation sets come in…',
        likes: 203,
      },
    ],
  },
];

export default async function Home() {
  //const session = await getSession();

  return (
    <HydrateClient>
      <main className="overflow-x-clip relative min-h-screen w-screen overflow-hidden gradient-to-b from-background to-secondary text-foreground">
        <div className="w-full h-screen absolute top-0 left-0 bg-linear-to-b from-transparent to-background z-10" />
        <div className="absolute w-full h-screen inset-0 z-0 opacity-50">
          <Dither
            waveColor={[0.5, 1, 0.7]}
            disableAnimation={false}
            enableMouseInteraction
            mouseRadius={0.3}
            colorNum={4}
            waveAmplitude={0.3}
            waveFrequency={3}
            waveSpeed={0.05}
          />
        </div>
        <div className="absolute inset-0 z-0 bg-linear-to-b from-zinc-950/50 via-transparent to-zinc-950/80" />
        <Navbar />
        <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-col gap-24 px-4 pb-32 pt-28 md:px-8">
          <section className="flex flex-row items-center justify-center gap-8 text-left ">
            <div className="space-y-6">
              <h1 className="font-serif text-4xl font-normal leading-[1.1] bg-linear-to-r from-primary via-emerald-200 to-white bg-clip-text tracking-tight text-transparent sm:text-5xl lg:text-6xl">
                Doomscroll any course syllabus
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                Upload your course material and let AI break them into
                Twitter-style threads that you can doomscroll through.
              </p>
              <Link
                href="/dashboard"
                className="hover:bg-primary/10 hover:border-primary/50 transition-colors duration-300 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-zinc-600 bg-zinc-900 px-8 py-3"
              >
                <Sparkles className="h-4 w-4" /> Get Started
              </Link>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Iphone src="/preview.jpeg" className="w-md object-scale-down" />
            </div>
          </section>

          {/* ── feature cards ───────────────────────────────────────── */}
          <section className="grid gap-4 md:grid-cols-3">
            {[
              {
                accent: "bg-primary/20",
                title: "Chunked concepts",
                body: "Break big topics into small, tweet-sized ideas with clear progress so learners never feel lost or overwhelmed.",
              },
              {
                accent: "bg-chart-3/20",
                title: "Knowledge base uploads",
                body: "Feed PPTs, PDFs, and docs into your private knowledge base. We summarize, chunk, and store them for RAG-powered threads.",
              },
              {
                accent: "bg-chart-2/20",
                title: "Checkpoints & leaderboards",
                body: "Swipe through checkpoints like Tinder, compete on leaderboards, and track how deep you've explored each topic.",
              },
            ].map(({ accent, title, body }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-md transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/50"
              >
                {/* subtle top-left glow */}
                <div
                  className={`absolute -left-4 -top-4 h-20 w-20 rounded-full blur-2xl opacity-40 ${accent}`}
                />
                <div
                  className={`relative mb-4 h-8 w-8 rounded-lg ${accent} ring-1 ring-white/5`}
                />
                <h2 className="mb-2 text-sm font-semibold tracking-tight text-white">
                  {title}
                </h2>
                <p className="text-sm leading-relaxed text-zinc-400">{body}</p>
              </div>
            ))}
          </section>

          {/* ── story section ────────────────────────────────────────── */}
          <section className="grid gap-12 md:grid-cols-[1.2fr,1fr] md:items-center">
            <div className="space-y-5">
              <h2 className="font-serif text-2xl font-normal tracking-tight text-white md:text-3xl">
                Designed for learning from stories, not slides
              </h2>
              <p className="text-base leading-relaxed text-zinc-400">
                Instead of dumping information, each thread is a conversation:
                fake tweets argue, correct, and build on each other in
                chronological order. Learners see both the right takes and the
                wrong ones, and watch how ideas evolve.
              </p>
              <p className="text-base leading-relaxed text-zinc-400">
                This is especially powerful for slower learners who benefit from
                context, repetition, and concrete examples—not just bullet
                points. Every concept feels like a mini Twitter drama you can
                scroll through.
              </p>
            </div>

            {/* mock thread card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-2xl shadow-black/30 backdrop-blur-md overflow-hidden">
              <p className="px-5 pt-5 pb-2 text-[10px] font-semibold uppercase tracking-widest text-primary/70">
                Sample thread snapshot
              </p>
              <div className="divide-y divide-border">
                {SAMPLE_THREAD.map((tweet, index) => (
                  <ThreadTweetCard
                    key={tweet.id}
                    tweet={tweet}
                    showConnector={index < SAMPLE_THREAD.length - 1}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </HydrateClient>
  );
}
