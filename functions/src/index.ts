// import * as functions from 'firebase-functions';
// import {Storage} from '@google-cloud/storage';
// const gcs = new Storage();
// import * as os from 'os';
// import * as path from 'path';
// import { spawn } from 'child_process';


// // const gcs = require('@google-cloud/storage')();

// // // Start writing Firebase Functions
// // // https://firebase.google.com/docs/functions/typescript
// //
// // export const helloWorld = functions.https.onRequest((request, response) => {
// //  response.send("Hello from Firebase!");
// // });

// export const onFileChange = functions.storage.object().onFinalize(object => {
//   const thisObject = object;
//   const fileBucket = thisObject.bucket;
//   const contentType = thisObject.contentType;
//   const filePath = <string>thisObject.name;
//   console.log('File change detected, function execution started');


//   if (object.timeDeleted) {
//     console.log('File already delted, exit...')
//   }

//   if (path.basename(filePath).startsWith('resized-')) {
//     console.log('File has already been renamed');
//     return;
//   }

//   const destBucket = gcs.bucket(fileBucket);
//   // This is a temporary filepath that is cleaned up after the operation
//   // Path.basename gets the filename part of the full file path
//   const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
//   const metadata = { contentType: contentType };

//   return destBucket.file(filePath).download({
//     destination: tempFilePath
//   }).then(() => {
//     return spawn('convert', [tempFilePath, '-resize', '300x300', tempFilePath]);
//   }).then(() => {
//     return destBucket.upload(tempFilePath, {
//       destination: 'resized-' + path.basename(filePath),
//       metadata: metadata
//     })
//   });
        
     
// });


// // GOOGLE VERSION

// import * as functions from 'firebase-functions';
// import {Storage} from '@google-cloud/storage';
// const gcs = new Storage();
// import { spawn } from 'child_process';
// import { join, dirname, basename } from 'path';
// import { tmpdir } from 'os';
// import * as fs from 'fs';
// import * as sharp from 'sharp';

// // Courtesy of https://firebase.google.com/docs/functions/gcp-storage-events
// export const generateThumbnail = functions.storage.object().onFinalize((object) => {
//   const fileBucket = object.bucket; // The Storage bucket that contains the file.
//   const filePath = <string>object.name; // File path in the bucket.
//   const contentType = <string>object.contentType; // File content type.
//   // const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

//   // Exit if this is triggered on a file that is not an image.
//   if (!contentType.startsWith('image/')) {
//     console.log('This is not an image.');
//     return null;
//   }

//   // Get the file name.
//   const fileName = basename(filePath);
//   // Exit if the image is already a thumbnail.
//   if (fileName.startsWith('thumb_')) {
//     console.log('Already a Thumbnail.');
//     return null;
//   }

//   // Download file from bucket.
//   const bucket = gcs.bucket(fileBucket);
//   const tempFilePath = join(tmpdir(), fileName);
//   const metadata = {
//     contentType: contentType,
//   };

//   return bucket.file(filePath).download({
//     destination: tempFilePath,
//   }).then(() => {
//     console.log('Image downloaded locally to', tempFilePath);
//     // Generate a thumbnail using ImageMagick.
//     return spawn('convert', [tempFilePath, '-resize', '100x100>', `${tempFilePath}.png`]);
//   }).then(() => {
//     console.log('Thumbnail created at', tempFilePath);
//     // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
//     const thumbFileName = `thumb_${fileName}`;
//     const thumbFilePath = join(dirname(filePath), thumbFileName);
//     console.log('Thumbnail to be saved at', thumbFilePath)
//     // Uploading the thumbnail.
//     return bucket.upload(tempFilePath, {
//       destination: thumbFilePath,
//       metadata: metadata,
//     });
//     // Once the thumbnail has been uploaded delete the local file to free up disk space.
//   }).then(() => fs.unlinkSync(tempFilePath));


// });

// ANGULARFIRESTORE VERSION
// Courtesty of https://angularfirebase.com/lessons/image-thumbnail-resizer-cloud-function/
import * as functions from 'firebase-functions';
import {Storage} from '@google-cloud/storage';
const gcs = new Storage();
import { join, dirname, basename } from 'path';
import { tmpdir } from 'os';
import * as sharp from 'sharp';
import * as fs from 'fs-extra'; // Mirrors the existing filesystem methods, but uses Promises

// Courtesy of https://firebase.google.com/docs/functions/gcp-storage-events
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

    // // Exit if the image is already a thumbnail.
    // if (fileName.includes('thumb@')) {
    //   console.log('Thumbnail already created.');
    //   return false;
    // }

    // Exit if the image has already been modified.
    if (existingMetadata.resizedImage === 'true') {
      console.log('Object has already been resized', existingMetadata.resizedImage);
      return false;
    }

    if (metageneration > 2) {
      console.log('Object metadata has been modified more than twice');
      return false;
    }

    // UPDATE THIS TO CREATE A NEW VERSION OF THE EXISTING FILE (RATHER THAN NEW SEAPARATE FILES)

    // 1. Ensure thumbnail dir exists
    await fs.ensureDir(workingDir);

    // 2. Download Source File
    await bucket.file(filePath).download({
      destination: tmpFilePath
    });
    console.log('Image downloaded locally to', tmpFilePath);

    // 3. Resize the images and define an array of upload promises
    const sizes = [128];

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