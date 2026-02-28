"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/trpc/react";
import { Pattern as FileUploadTable } from "@/components/patterns/p-file-upload-6";
import { type FileMetadata, type FileWithPreview } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Loader2, Sparkles, ExternalLink } from "lucide-react";
import { StatsCard } from "@/components/global/stats-card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useNavbarCenter } from "@/components/global/navbar-context";

async function uploadFile(fileWithPreview: FileWithPreview, knowledgeBaseId: string) {
  const file = fileWithPreview.file;
  if (!(file instanceof File)) return;
  const formData = new FormData();
  formData.append("id", knowledgeBaseId);
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? "Upload failed");
  }
  return res.json();
}

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

  const { data: course, isLoading, refetch } =
    api.knowledgeBase.getById.useQuery(courseId);

  useNavbarCenter(
    course ? { title: course.title, description: course.description } : null,
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFilesAdded = async (newFiles: FileWithPreview[]) => {
    if (newFiles.length === 0) return;
    setIsUploading(true);
    try {
      await Promise.all(
        newFiles.map((f) => uploadFile(f, courseId))
      );
      void refetch();
      toast.success(`${newFiles.length} file${newFiles.length > 1 ? "s" : ""} uploaded`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

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
              simulateUpload
              onFilesAdded={handleFilesAdded}
            />
          </div>
          {isUploading && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Uploading…
            </p>
          )}
        </section>

        {/* ── generate ───────────────────────────────────────────────── */}
        <div className="flex gap-2 justify-end">
          <Button
            disabled={isGenerating || course.files.length === 0}
            onClick={handleGenerate}
            className="gap-2"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isGenerating ? "Generating…" : "Generate Thread"}
          </Button>
          <Link href={`/dashboard/threads/${courseId}`}>
            <Button className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View Threads
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
