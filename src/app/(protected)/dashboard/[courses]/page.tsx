"use client";

import { use, useState } from "react";
import Link from "next/link";
import { getCourse, getThread } from "@/lib/mock-data";
import { Pattern as FileUploadTable } from "@/components/patterns/p-file-upload-6";
import { formatBytes, type FileMetadata } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { StatsCard } from "@/components/global/stats-card";

interface PageProps {
  params: Promise<{ courses: string }>;
}
const MOCK_FILES: FileMetadata[] = [
  {
    id: "f1",
    name: "lecture-notes-week1.pdf",
    size: 2_516_582,
    type: "application/pdf",
    url: "",
  },
  {
    id: "f2",
    name: "syllabus.pdf",
    size: 524_288,
    type: "application/pdf",
    url: "",
  },
  {
    id: "f3",
    name: "homework-solutions.docx",
    size: 1_153_434,
    type: "application/msword",
    url: "",
  },
];

// ─── small helpers ────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

type StatsCardAccent = "green" | "red" | "default";

const accentClasses: Record<StatsCardAccent, string> = {
  green: "bg-emerald-500/10 text-emerald-500",
  red: "bg-destructive/10 text-destructive",
  default: "bg-primary/10 text-primary",
};

export default function CoursePage({ params }: PageProps) {
  const { courses: courseId } = use(params);

  const course = getCourse(courseId);
  const thread = course?.threadId ? getThread(course.threadId) : null;

  const [isGenerating, setIsGenerating] = useState(false);
  const [files, setFiles] = useState<FileMetadata[]>(MOCK_FILES);

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  const lastUpload = course?.uploadedAt
    ? formatDate(course.uploadedAt)
    : "No files yet";
  const lastGenerated = thread?.generatedAt
    ? formatDate(thread.generatedAt)
    : null;

  const handleGenerate = () => {
    setIsGenerating(true);
    // Wire up your real generation call here
    setTimeout(() => setIsGenerating(false), 2000);
  };

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

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex flex-1 flex-col gap-8 p-6 pb-32 lg:p-8 lg:pb-32">
        {/* ── stats ───────────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-3 text-sm font-medium">Overview</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              label="Files"
              stat={String(files.length)}
              description="in the knowledge base"
            />
            <StatsCard
              label="Total size"
              stat={formatBytes(totalSize)}
              description="across all files"
            />
            <StatsCard
              label="Last upload"
              stat={course.uploadedAt ? lastUpload.split(",")[0]! : "—"}
              description={
                course.uploadedAt
                  ? lastUpload.split(",").slice(1).join(",").trim()
                  : "No uploads yet"
              }
            />
            <StatsCard
              label="Thread"
              stat={thread ? "Generated" : "Not yet"}
              description={
                lastGenerated ? `Last: ${lastGenerated}` : "No thread yet"
              }
            />
          </div>
        </section>

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
              initialFiles={files}
              simulateUpload={false}
              onFilesChange={(updated) => {
                // Wire up your real file list sync here
                setFiles(
                  updated.map((f) => ({
                    id: f.id,
                    name: f.file.name,
                    size: f.file.size,
                    type:
                      f.file instanceof File
                        ? f.file.type
                        : (f.file.type ?? ""),
                    url: f.file instanceof File ? "" : (f.file.url ?? ""),
                  })),
                );
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
