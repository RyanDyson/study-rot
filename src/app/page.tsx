import Link from "next/link";
import { Navbar } from "@/components/global/navbar";
import { getSession } from "@/server/better-auth/server";
import { HydrateClient } from "@/trpc/server";
import { Dither } from "@/components/Dither";
import { Sparkles } from "lucide-react";
import { Iphone } from "@/components/ui/iphone";

export default async function Home() {
  const session = await getSession();

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
              <h1 className="font-serif text-4xl font-normal leading-[1.1] bg-linear-to-r from-primary via-emerald-200 to-primary bg-clip-text tracking-tight text-white sm:text-5xl lg:text-6xl">
                Doomscroll any course syllabus
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                Upload your course material and let AI break them into
                Twitter-style threads that you can doomscroll through.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-zinc-600 bg-zinc-900 px-8 py-3"
              >
                <Sparkles className="h-4 w-4" /> Get Started
              </Link>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Iphone className="w-md" />
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            <div className="group rounded-2xl border border-zinc-700/60 bg-zinc-900/40 p-6 backdrop-blur-md transition-all duration-300 hover:border-zinc-600/80 hover:bg-zinc-900/60 hover:shadow-xl hover:shadow-black/10">
              <div className="mb-3 h-8 w-8 rounded-lg bg-primary/20" />
              <h2 className="mb-2 text-sm font-semibold tracking-tight text-white">
                Chunked concepts
              </h2>
              <p className="text-sm leading-relaxed text-zinc-400">
                Break big topics into small, tweet-sized ideas with clear
                progress so learners never feel lost or overwhelmed.
              </p>
            </div>
            <div className="group rounded-2xl border border-zinc-700/60 bg-zinc-900/40 p-6 backdrop-blur-md transition-all duration-300 hover:border-zinc-600/80 hover:bg-zinc-900/60 hover:shadow-xl hover:shadow-black/10">
              <div className="mb-3 h-8 w-8 rounded-lg bg-chart-3/20" />
              <h2 className="mb-2 text-sm font-semibold tracking-tight text-white">
                Knowledge base uploads
              </h2>
              <p className="text-sm leading-relaxed text-zinc-400">
                Feed PPTs, PDFs, and docs into your private knowledge base. We
                summarize, chunk, generate embeddings, and store them for
                RAG-powered threads.
              </p>
            </div>
            <div className="group rounded-2xl border border-zinc-700/60 bg-zinc-900/40 p-6 backdrop-blur-md transition-all duration-300 hover:border-zinc-600/80 hover:bg-zinc-900/60 hover:shadow-xl hover:shadow-black/10">
              <div className="mb-3 h-8 w-8 rounded-lg bg-chart-2/20" />
              <h2 className="mb-2 text-sm font-semibold tracking-tight text-white">
                Checkpoints & leaderboards
              </h2>
              <p className="text-sm leading-relaxed text-zinc-400">
                Swipe through checkpoints like Tinder, compete on leaderboards,
                and track how deep you&apos;ve explored each topic.
              </p>
            </div>
          </section>

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
            <div className="rounded-2xl border border-zinc-700/60 bg-zinc-900/50 p-6 shadow-2xl shadow-black/20 backdrop-blur-md">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-primary">
                Sample thread snapshot
              </p>
              <div className="space-y-3">
                <div className="flex gap-3 rounded-sm border border-zinc-700/40 bg-zinc-800/60 p-4">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-primary/30" />
                  <div>
                    <p className="text-xs font-semibold text-primary">
                      @ConceptBot
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                      Hot take: &quot;Overfitting is just your model trying
                      really hard.&quot; 🔥
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-sm border border-zinc-700/40 bg-zinc-800/60 p-4">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-chart-3/30" />
                  <div>
                    <p className="text-xs font-semibold text-chart-3">
                      @ExplainAI
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                      Not quite. Overfitting means your model memorizes the
                      training data and fails on new data. Let&apos;s walk
                      through an example 👇
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-sm border border-zinc-700/40 bg-zinc-800/60 p-4">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-destructive/30" />
                  <div>
                    <p className="text-xs font-semibold text-destructive">
                      @MythBuster
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                      Misconception: &quot;More parameters always = better
                      model.&quot; This is where regularization and validation
                      sets come in…
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-20 pt-24 md:px-8">
          <section className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Turn any syllabus into{" "}
                <span className="bg-linear-to-r from-primary to-chart-3 bg-clip-text text-transparent">
                  bingeable threads
                </span>
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                Upload your slides, PDFs, or notes and let AI break them into
                Twitter-style threads that go wide or deep on each concept, mix
                in misconceptions, and build a story for slow-but-steady
                learners.
              </p>
            </div>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary-foreground px-6 py-2.5 text-sm font-medium text-primary shadow-md shadow-primary/30 transition hover:-translate-y-0.5 hover:opacity-90"
              >
                Start a learning thread
              </Link>
              <Link
                href="/dashboard/upload"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-border bg-muted px-6 py-2.5 text-sm font-medium text-foreground backdrop-blur transition hover:-translate-y-0.5 hover:bg-accent"
              >
                Upload syllabus / slides
              </Link>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5 backdrop-blur">
              <h2 className="mb-2 text-sm font-semibold text-foreground">
                Chunked concepts
              </h2>
              <p className="text-xs text-muted-foreground">
                Break big topics into small, tweet-sized ideas with clear
                progress so learners never feel lost or overwhelmed.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 backdrop-blur">
              <h2 className="mb-2 text-sm font-semibold text-foreground">
                Knowledge base uploads
              </h2>
              <p className="text-xs text-muted-foreground">
                Feed PPTs, PDFs, and docs into your private knowledge base. We
                summarize, chunk, generate embeddings, and store them for
                RAG-powered threads.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 backdrop-blur">
              <h2 className="mb-2 text-sm font-semibold text-foreground">
                Checkpoints & leaderboards
              </h2>
              <p className="text-xs text-muted-foreground">
                Swipe through checkpoints like Tinder, compete on leaderboards,
                and track how deep you&apos;ve explored each topic.
              </p>
            </div>
          </section>

          <section className="grid gap-10 md:grid-cols-[1.3fr,1fr] md:items-center">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Designed for learning from stories, not slides
              </h2>
              <p className="text-sm text-muted-foreground">
                Instead of dumping information, each thread is a conversation:
                fake tweets argue, correct, and build on each other in
                chronological order. Learners see both the right takes and the
                wrong ones, and watch how ideas evolve.
              </p>
              <p className="text-sm text-muted-foreground">
                This is especially powerful for slower learners who benefit from
                context, repetition, and concrete examples—not just bullet
                points. Every concept feels like a mini Twitter drama you can
                scroll through.
              </p>
            </div>
            <div className="rounded-2xl border border-primary/30 bg-card p-5 text-xs text-foreground/90 shadow-lg shadow-primary/20">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-primary">
                Sample thread snapshot
              </p>
              <div className="space-y-3">
                <div className="rounded-xl bg-muted p-3">
                  <p className="text-[11px] font-semibold text-primary">
                    @ConceptBot
                  </p>
                  <p className="mt-1 text-[11px] text-foreground/90">
                    Hot take: &quot;Overfitting is just your model trying really
                    hard.&quot; 🔥
                  </p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <p className="text-[11px] font-semibold text-chart-3">
                    @ExplainAI
                  </p>
                  <p className="mt-1 text-[11px] text-foreground/90">
                    Not quite. Overfitting means your model memorizes the
                    training data and fails on new data. Let&apos;s walk through
                    an example 👇
                  </p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <p className="text-[11px] font-semibold text-destructive">
                    @MythBuster
                  </p>
                  <p className="mt-1 text-[11px] text-foreground/90">
                    Misconception: &quot;More parameters always = better
                    model.&quot; This is where regularization and validation
                    sets come in…
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </HydrateClient>
  );
}
