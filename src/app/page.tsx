import Link from "next/link";
import { Navbar } from "@/components/global/navbar";
import { getSession } from "@/server/better-auth/server";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  const session = await getSession();

  return (
    <HydrateClient>
      <main className="bg-linear-to-b min-h-screen w-screen from-background to-secondary text-foreground">
        <Navbar />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-20 pt-24 md:px-8">
          <section className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Turn any syllabus into{" "}
                <span className="bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
                  bingeable threads
                </span>
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                Upload your slides, PDFs, or notes and let AI break them into
                Twitter-style threads that go wide or deep on each concept,
                mix in misconceptions, and build a story for slow-but-steady
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
                Feed PPTs, PDFs, and docs into your private knowledge base.
                We summarize, chunk, generate embeddings, and store them for
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
                This is especially powerful for slower learners who benefit
                from context, repetition, and concrete examples—not just
                bullet points. Every concept feels like a mini Twitter drama
                you can scroll through.
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
                    Hot take: &quot;Overfitting is just your model trying
                    really hard.&quot; 🔥
                  </p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <p className="text-[11px] font-semibold text-chart-3">
                    @ExplainAI
                  </p>
                  <p className="mt-1 text-[11px] text-foreground/90">
                    Not quite. Overfitting means your model memorizes the
                    training data and fails on new data. Let&apos;s walk
                    through an example 👇
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
