// ANGULARFIRESTORE VERSION
import * as functions from 'firebase-functions';
import {Storage} from '@google-cloud/storage';
const gcs = new Storage();
import { join, dirname, basename } from 'path';
import { tmpdir } from 'os';
import * as sharp from 'sharp';
import * as fs from 'fs-extra'; // Mirrors the existing filesystem methods, but uses Promises

// Courtesty of https://angularfirebase.com/lessons/image-thumbnail-resizer-cloud-function/
export const generateThumbnail = functions.storage
  .object()
  .onFinalize( async object => {
    const bucket = gcs.bucket(object.bucket); // The Storage bucket that contains the file.
    const filePath = <string>object.name; // File path in the bucket.
    const fileName = basename(filePath); // Get the file name.
    const contentType = <string>object.contentType; // File content type, used for upload of new file.
    const metageneration = parseInt(<string>object.metageneration, 10);
    const existingMetadata = <{[key: string]: string}>object.metadata;
    
    const bucketDir = dirname(filePath);

    const workingDir = join(tmpdir(), 'resized'); // Create a working directory
    const tmpFilePath = join(workingDir, fileName) // Create a temp file path

    console.log(object);


    // Exit if this is triggered on a file that is not an image.
    if (!contentType || !contentType.includes('image')) {
      console.log('Object is not an image.');
      return false;
    }
    // Exit if the image has already been modified.
    if (existingMetadata.resizedImage === 'true') {
      console.log('Object has already been resized', existingMetadata.resizedImage);
      return false;
    }

    if (metageneration > 2) {
      console.log('Object metadata has been modified more than twice');
      return false;
    }

    // 1. Ensure thumbnail dir exists
    await fs.ensureDir(workingDir);

    // 2. Download Source File
    await bucket.file(filePath).download({
      destination: tmpFilePath
    });
    console.log('Image downloaded locally to', tmpFilePath);

    // 3. Resize the images and define an array of upload promises
    const sizes = [128];
    
    // Currently this is configured to REPLACE origin file (rather than multiple files with unique names), meaning only final output will exist
    // To properly store multiple sizes without replacing origin file, change desitantion 'fileName' to 'thumbName'
    const uploadPromises = sizes.map(async size => {
      const thumbName = `thumb@${size}_${fileName}`;
      const thumbPath = join(workingDir, thumbName);
      const destination = join(bucketDir, fileName);
      const metadata = {
        ...existingMetadata,
        resizedImage: 'true'
      };

      // Resize source image
      await sharp(tmpFilePath)
        .resize(size, size)
        .toFile(thumbPath);
      console.log('Thumbnail created at', tmpFilePath);
      
      console.log('Thumbnail to be saved at', destination)
      
      // Upload to GCS
      return bucket.upload(thumbPath, {
        destination: destination,
        contentType: contentType,
        metadata: {metadata: metadata},
      });
    });

    // 4. Run the upload operations
    await Promise.all(uploadPromises);
    console.log('All thumbnails uploaded');

    // 5. Cleanup remove the tmp/thumbs from the filesystem
    return fs.remove(workingDir);

});