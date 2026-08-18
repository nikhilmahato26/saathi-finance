import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Local-disk file storage for dev. PRODUCT.md lists S3-compatible object
 * storage as an undecided integration (see Implementation Plan, section 5) -
 * this keeps the same interface (leadId + File in, public URL out) so
 * swapping in real S3 later only touches this file.
 */
export async function saveUploadedFile(leadId: string, file: File): Promise<string> {
  const dir = path.join(process.cwd(), "public", "uploads", "leads", leadId);
  await mkdir(dir, { recursive: true });

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const filename = `${Date.now()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return `/uploads/leads/${leadId}/${filename}`;
}

export async function savePdf(leadId: string, filename: string, bytes: Uint8Array): Promise<string> {
  const dir = path.join(process.cwd(), "public", "uploads", "leads", leadId);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);
  return `/uploads/leads/${leadId}/${filename}`;
}
