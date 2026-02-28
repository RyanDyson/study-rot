"use client"

import { Pattern as TableUpload } from "@/components/patterns/p-file-upload-6";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function DashboardUploadPage() {
  return (
    <div className="flex flex-1 w-full flex-col items-center gap-6 p-6">
      <section className="w-full max-w-2xl space-y-4">
        <h2 className="text-lg font-medium">File upload</h2>
        <div className="rounded-lg border bg-card p-6">
          <TableUpload
            maxFiles={10}
            maxSize={50 * 1024 * 1024}
            accept="*"
            multiple
            simulateUpload
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
