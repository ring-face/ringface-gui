
import { Express } from 'express';
import logger from './logger'
import { Storage, Bucket } from '@google-cloud/storage';

var bucket: Bucket;

connectGcs();

async function connectGcs() {
  const storage = new Storage();
  const bucketName = process.env.GCS_BUCKET;
  bucket = storage.bucket(bucketName);

  try {
    const [exists] = await bucket.exists();
    if (exists) {
      console.log(`Bucket ${bucketName} is connected.`);
    } else {
      console.log(`Bucket ${bucketName} does not exist or is not accessible.`);
    }
  } catch (error) {
    console.error('Error:', error);
  }

  try {
    const [metadata] = await bucket.getMetadata();
    console.log('Metadata:', metadata);
  } catch (error) {
    console.error('Error:', error);
  }
}


export function gcsProxy(app: Express) {



  /**
   * Local storage proxy
   */
  // app.get('/api/images/*', (req, res) => {
  //   const imagePath = req.path.substring(12);
  //   logger.debug(`getting image ${imagePath}`);

  //   res.sendFile(imagePath, { root: process.env.DATA_DIR });

  // });


  // app.use("/api/videos", express.static(process.env.DATA_DIR + 'data/videos'));

  app.get('/api/images/*', (req, res) => {
    const imagePath = req.path.substring(12); // Extract the image path
    logger.debug(`getting image ${imagePath} from ${process.env.GCS_BUCKET}`);

    const file = bucket.file(imagePath);

    // Check if the file exists
    file.exists().then(data => {
      const exists = data[0];
      if (!exists) {
        logger.error(`image not found`);
        return res.status(404).send(` ${imagePath} Not found`);
      }

      // Set appropriate content type
      file.getMetadata().then(data => {
        const metadata = data[0];
        res.contentType(metadata.contentType);

        // Stream the file from GCS to the client
        file.createReadStream()
          .on('error', (error) => {
            logger.error(`Error streaming file: ${error}`);
            res.status(500).send('Error streaming file');
          })
          .pipe(res);
      }).catch(error => {
        logger.error(`Error getting file metadata: ${error}`);
        res.status(500).send('Error getting file metadata');
      });
    }).catch(error => {
      logger.error(`Error checking file existence: ${error}`);
      res.status(500).send('Error checking file existence');
    });
  });


  app.get('/api/videos/:videoName', (req, res) => {
    const videoName = req.params.videoName;
    logger.debug(`Getting video ${videoName}`);

    const file = bucket.file(`videos/${videoName}`);

    // Check if the file exists
    file.exists().then(data => {
      const exists = data[0];
      if (!exists) {
        logger.error(`Video not found`);

        return res.status(404).send('Video not found');
      }

      // Set appropriate content type for video
      file.getMetadata().then(data => {
        const metadata = data[0];
        res.contentType(metadata.contentType);

        // Stream the video file from GCS to the client
        file.createReadStream()
          .on('error', (error) => {
            logger.error(`Error streaming video file: ${error}`);
            res.status(500).send('Error streaming video file');
          })
          .pipe(res);
      }).catch(error => {
        logger.error(`Error getting video file metadata: ${error}`);
        res.status(500).send('Error getting video file metadata');
      });
    }).catch(error => {
      logger.error(`Error checking video file existence: ${error}`);
      res.status(500).send('Error checking video file existence');
    });
  });
}

