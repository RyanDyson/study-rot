import { db } from "@/server/db";
import { knowledgeFiles } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import path from "path";
import { extractTextFromPdf } from "./pdf-extractor";
import { extractTextFromPptx } from "./pptx-extractor";

export async function runOcrForFile(
  fileId: string,
  filePath: string,
  fileName: string,
): Promise<void> {
  await db
    .update(knowledgeFiles)
    .set({ ocrStatus: "processing" })
    .where(eq(knowledgeFiles.id, fileId));

  try {
    const ext = path.extname(fileName).toLowerCase();
    let extractedText: string;

    if (ext === ".pdf") {
      extractedText = await extractTextFromPdf(filePath);
    } else if (ext === ".pptx") {
      extractedText = extractTextFromPptx(filePath);
    } else {
      extractedText = "";
    }

    await db
      .update(knowledgeFiles)
      .set({ ocrStatus: "completed", extractedText })
      .where(eq(knowledgeFiles.id, fileId));
  } catch (err) {
    console.error(`OCR failed for file ${fileId}:`, err);
    await db
      .update(knowledgeFiles)
      .set({ ocrStatus: "failed" })
      .where(eq(knowledgeFiles.id, fileId));
  }
}
