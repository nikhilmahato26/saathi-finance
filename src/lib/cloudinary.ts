import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

export function ensureCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing.");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export { cloudinary };

/**
 * Uploads a Buffer (image, pdf, or raw document) to Cloudinary via stream.
 *
 * @param buffer - File content buffer
 * @param folder - Cloudinary folder path (e.g., 'saathi-finance/leads/{leadId}/documents')
 * @param filename - Original filename with extension
 * @returns Secure HTTPS delivery URL
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
  filename: string
): Promise<string> {
  ensureCloudinaryConfig();
  const cleanId = filename.replace(/\.[^/.]+$/, "");

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: `${Date.now()}-${cleanId}`,
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error: Error | undefined, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed: empty result"));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Helper to delete an asset from Cloudinary by public ID if needed.
 */
export async function deleteCloudinaryAsset(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error(`[Cloudinary] Failed to destroy asset ${publicId}:`, err);
  }
}
