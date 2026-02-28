import AdmZip from "adm-zip";

export function extractTextFromPptx(filePath: string): string {
  const zip = new AdmZip(filePath);
  const entries = zip.getEntries();

  const slideEntries = entries
    .filter((e) => /^ppt\/slides\/slide\d+\.xml$/.test(e.entryName))
    .sort((a, b) => {
      const numA = parseInt(a.entryName.match(/slide(\d+)\.xml/)?.[1] ?? "0");
      const numB = parseInt(b.entryName.match(/slide(\d+)\.xml/)?.[1] ?? "0");
      return numA - numB;
    });

  const texts = slideEntries.map((entry) => {
    const xml = entry.getData().toString("utf8");
    return xml
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  });

  return texts.join("\n\n");
}
