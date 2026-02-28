"use client";

import { use, useState } from "react";
import Link from "next/link";
import { api } from "@/trpc/react";
import { Pattern as FileUploadTable } from "@/components/patterns/p-file-upload-6";
import { type FileMetadata } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import { StatsCard } from "@/components/global/stats-card";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  params: Promise<{ courses: string }>;
}

function formatDate(date: Date | null | undefined) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function CoursePage({ params }: PageProps) {
  const { courses: courseId } = use(params);

  const { data: course, isLoading } =
    api.knowledgeBase.getById.useQuery(courseId);

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-full flex-col gap-8 p-6 lg:p-8">
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <BookOpen className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">Course not found.</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </div>
    );
  }

  const sortedFiles = [...course.files].sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime(),
  );
  const lastUploadDate = formatDate(sortedFiles[0]?.createdAt);

  const initialFiles: FileMetadata[] = course.files.map((f) => ({
    id: f.id,
    name: f.name,
    size: 0,
    type: "",
    url: "",
  }));

  return (
    <div className="flex min-h-full flex-col">
      {/* ── sticky header ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex items-center gap-4 px-6 py-4">
          <Link
            href="/dashboard"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold text-foreground">
                {course.title}
              </h1>
              <p className="truncate text-xs text-muted-foreground">
                {course.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-8 p-6 lg:p-8">
        {/* ── stats ─────────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-3 text-sm font-medium">Overview</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <StatsCard
              label="Files"
              stat={String(course.files.length)}
              description="in the knowledge base"
            />
            <StatsCard
              label="Last upload"
              stat={lastUploadDate ?? "—"}
              description={
                lastUploadDate ? "most recent file added" : "No files yet"
              }
            />
          </div>
        </section>

        {/* ── knowledge base ─────────────────────────────────────────── */}
        <section>
          <div className="mb-4">
            <h2 className="text-sm font-medium text-foreground">
              Knowledge Base
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Add or remove files used to generate threads. Supported: PDF,
              DOCX, TXT, and more.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <FileUploadTable
              maxFiles={20}
              maxSize={50 * 1024 * 1024}
              accept="*"
              multiple
              initialFiles={initialFiles}
              simulateUpload={false}
            />
          </div>
        </section>

        {/* ── generate ───────────────────────────────────────────────── */}
        <div className="flex justify-end">
          <Button
            disabled={isGenerating || course.files.length === 0}
            onClick={handleGenerate}
            className="gap-2"
          >
            {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
            {isGenerating ? "Generating…" : "Generate Thread"}
          </Button>
        </div>
      </div>
    </div>
  );
}
