import { writeFile, mkdir, readdir, stat } from "fs/promises"
import path from "path"

const TMP_UPLOAD_DIR = path.join(process.cwd(), "tmp", "uploads")
const MAX_SIZE_BYTES = 50 * 1024 * 1024 // 50MB

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_")
}

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  const map: Record<string, string> = {
    ".pdf": "application/pdf",
    ".zip": "application/zip",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".json": "application/json",
    ".txt": "text/plain",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
  }
  return map[ext] ?? "application/octet-stream"
}

export async function GET() {
  try {
    await mkdir(TMP_UPLOAD_DIR, { recursive: true })
    const entries = await readdir(TMP_UPLOAD_DIR, { withFileTypes: true })
    const files = await Promise.all(
      entries
        .filter((e) => e.isFile())
        .map(async (e) => {
          const filepath = path.join(TMP_UPLOAD_DIR, e.name)
          const st = await stat(filepath)
          return {
            id: e.name,
            name: e.name,
            size: st.size,
            type: getMimeType(e.name),
            url: "",
          }
        })
    )
    return Response.json({ files })
  } catch (err) {
    console.error("List uploads error:", err)
    return Response.json({ error: "Failed to list uploads" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return Response.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return Response.json(
        { error: `File exceeds maximum size of ${MAX_SIZE_BYTES / 1024 / 1024}MB` },
        { status: 413 }
      )
    }

    await mkdir(TMP_UPLOAD_DIR, { recursive: true })

    const timestamp = Date.now()
    const safeName = sanitizeFilename(file.name)
    const filename = `${timestamp}-${safeName}`
    const filepath = path.join(TMP_UPLOAD_DIR, filename)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    return Response.json({
      ok: true,
      filename,
      path: filepath,
    })
  } catch (err) {
    console.error("Upload error:", err)
    return Response.json(
      { error: "Upload failed" },
      { status: 500 }
    )
  }
}
