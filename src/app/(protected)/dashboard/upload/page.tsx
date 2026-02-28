"use client"

import { useEffect, useState } from "react";
import { Pattern as TableUpload } from "@/components/patterns/p-file-upload-6";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import type { FileMetadata, FileWithPreview } from "@/hooks/use-file-upload";

async function uploadFile(fileWithPreview: FileWithPreview) {
  const file = fileWithPreview.file;
  if (!(file instanceof File)) return;
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Upload failed");
  }
  return res.json();
}

export default function DashboardUploadPage() {
  const [initialFiles, setInitialFiles] = useState<FileMetadata[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    fetch("/api/upload")
      .then((res) => (res.ok ? res.json() : { files: [] }))
      .then((data) => {
        setInitialFiles(data.files ?? []);
        setHasFetched(true);
      })
      .catch(() => setHasFetched(true));
  }, []);

  const handleFilesAdded = (files: FileWithPreview[]) => {
    void Promise.allSettled(files.map(uploadFile)).then((results) => {
      results.forEach((r, i) => {
        if (r.status === "rejected") console.error(`Upload ${i} failed:`, r.reason);
      });
    });
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
        <div className="flex justify-center">
          <Button variant="outline">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Threads
          </Button>
        </div>
      </section>
    </div>
  );
}
