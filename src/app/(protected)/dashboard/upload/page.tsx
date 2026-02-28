"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Pattern as TableUpload } from "@/components/patterns/p-file-upload-6";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import type { FileMetadata, FileWithPreview } from "@/hooks/use-file-upload";
import { api } from "@/trpc/react";

type OcrStatus = "pending" | "processing" | "completed" | "failed";

interface TrackedFile {
  fileId: string;
  name: string;
  ocrStatus: OcrStatus;
}

export default function DashboardUploadPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") ?? "default";
  const kbName = `kb-${courseId}`;

  const [initialFiles, setInitialFiles] = useState<FileMetadata[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [knowledgeBaseId, setKnowledgeBaseId] = useState<string | null>(null);
  const [trackedFiles, setTrackedFiles] = useState<TrackedFile[]>([]);

  const getOrCreate = api.knowledgeBase.getOrCreate.useMutation({
    onSuccess: (data) => setKnowledgeBaseId(data.id),
  });

  useEffect(() => {
    getOrCreate.mutate({ name: kbName });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kbName]);

  useEffect(() => {
    fetch("/api/upload")
      .then((res) => (res.ok ? res.json() : { files: [] }))
      .then((data) => {
        setInitialFiles((data as { files: FileMetadata[] }).files ?? []);
        setHasFetched(true);
      })
      .catch(() => setHasFetched(true));
  }, []);

  const pendingFileId = trackedFiles.find(
    (f) => f.ocrStatus === "pending" || f.ocrStatus === "processing",
  )?.fileId;

  const fileStatusQuery = api.knowledgeBase.getFileStatus.useQuery(
    pendingFileId ?? "",
    {
      enabled: !!pendingFileId,
      refetchInterval: 2000,
    },
  );

  useEffect(() => {
    if (fileStatusQuery.data) {
      const updated = fileStatusQuery.data;
      setTrackedFiles((prev) =>
        prev.map((f) =>
          f.fileId === updated.id ? { ...f, ocrStatus: updated.ocrStatus as OcrStatus } : f,
        ),
      );
    }
  }, [fileStatusQuery.data]);

  const getExtractedTexts = api.knowledgeBase.getExtractedTexts.useQuery(
    knowledgeBaseId ?? "",
    { enabled: false },
  );

  const handleFilesAdded = (files: FileWithPreview[]) => {
    if (!knowledgeBaseId) return;
    void Promise.allSettled(
      files.map(async (fileWithPreview) => {
        const file = fileWithPreview.file;
        if (!(file instanceof File)) return;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("knowledgeBaseId", knowledgeBaseId);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(data.error ?? "Upload failed");
        }
        const data = (await res.json()) as { fileId?: string };
        if (data.fileId) {
          setTrackedFiles((prev) => [
            ...prev,
            { fileId: data.fileId!, name: file.name, ocrStatus: "pending" },
          ]);
        }
      }),
    ).then((results) => {
      results.forEach((r, i) => {
        if (r.status === "rejected") console.error(`Upload ${i} failed:`, r.reason);
      });
    });
  };

  const hasCompleted = trackedFiles.some((f) => f.ocrStatus === "completed");

  const handleGenerate = () => {
    if (!knowledgeBaseId) return;
    void getExtractedTexts.refetch().then((result) => {
      console.log("Extracted texts:", result.data);
    });
  };

  const statusLabel: Record<OcrStatus, string> = {
    pending: "Queued",
    processing: "Extracting...",
    completed: "Ready",
    failed: "Failed",
  };

  return (
    <div className="flex flex-1 w-full flex-col items-center gap-6 p-6">
      <section className="w-full max-w-2xl space-y-4">
        <h2 className="text-lg font-medium">File upload</h2>
        <div className="rounded-lg border bg-card p-6">
          <TableUpload
            key={hasFetched ? "ready" : "loading"}
            maxFiles={10}
            maxSize={50 * 1024 * 1024}
            accept="*"
            multiple
            initialFiles={initialFiles}
            simulateUpload
            onFilesAdded={handleFilesAdded}
            onFilesChange={(files) => {
              console.log("Files changed:", files.length, files);
            }}
          />
        </div>
        {trackedFiles.length > 0 && (
          <ul className="space-y-1 text-sm">
            {trackedFiles.map((f) => (
              <li key={f.fileId} className="flex items-center justify-between gap-2">
                <span className="truncate text-muted-foreground">{f.name}</span>
                <span
                  className={
                    f.ocrStatus === "completed"
                      ? "text-green-600"
                      : f.ocrStatus === "failed"
                        ? "text-destructive"
                        : "text-amber-500"
                  }
                >
                  {statusLabel[f.ocrStatus]}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-center">
          <Button variant="outline" disabled={!hasCompleted} onClick={handleGenerate}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Threads
          </Button>
        </div>
      </section>
    </div>
  );
}
