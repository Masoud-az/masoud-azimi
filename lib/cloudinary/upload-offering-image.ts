import { UploadApiResponse } from "cloudinary";
import { getCloudinary } from "../cloudinary";

export async function uploadOfferingImage(
  file: File,
): Promise<UploadApiResponse> {
  const cloudinary = getCloudinary();
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "masoud-azimi/offerings",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          if (!result) {
            reject(new Error("Cloudinary upload returned no result."));
            return;
          }

          resolve(result);
        },
      )
      .end(buffer);
  });
}
