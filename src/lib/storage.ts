import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { uploadBufferToCloudinary } from "./cloudinary";

/**
 * Saves an uploaded document or screenshot to Cloudinary.
 * Falls back to local disk storage if Cloudinary is not configured or fails.
 */
export async function saveUploadedFile(leadId: string, file: File): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const filename = `${Date.now()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // If Cloudinary credentials are configured, upload to Cloudinary
  if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_CLOUD_NAME) {
    try {
      const cloudinaryUrl = await uploadBufferToCloudinary(
        buffer,
        `saathi-finance/leads/${leadId}/documents`,
        filename
      );
      return cloudinaryUrl;
    } catch (error) {
      console.error("[Storage] Cloudinary upload error, falling back to disk:", error);
    }
  }

  // Local-disk fallback
  const dir = path.join(process.cwd(), "public", "uploads", "leads", leadId);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);

  return `/uploads/leads/${leadId}/${filename}`;
}

/**
 * Saves a generated loan application PDF to Cloudinary.
 * Falls back to local disk storage if Cloudinary is not configured or fails.
 */
export async function savePdf(leadId: string, filename: string, bytes: Uint8Array): Promise<string> {
  const buffer = Buffer.from(bytes);

  if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_CLOUD_NAME) {
    try {
      const cloudinaryUrl = await uploadBufferToCloudinary(
        buffer,
        `saathi-finance/leads/${leadId}/applications`,
        filename
      );
      return cloudinaryUrl;
    } catch (error) {
      console.error("[Storage] Cloudinary PDF upload error, falling back to disk:", error);
    }
  }

  const dir = path.join(process.cwd(), "public", "uploads", "leads", leadId);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);

  return `/uploads/leads/${leadId}/${filename}`;
}
