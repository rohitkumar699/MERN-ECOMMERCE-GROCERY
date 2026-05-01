import multer from "multer";
import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

// memory storage instead of disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

// function to upload file
const uploadToBlob = async (file) => {
  // Client created here, not at top level — env is loaded by now
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
  );
  const containerClient = blobServiceClient.getContainerClient("uploads");

  const blobName = uuidv4() + "-" + file.originalname;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.upload(file.buffer, file.size, {
    blobHTTPHeaders: {
      blobContentType: file.mimetype,
    },
  });

  return blockBlobClient.url;
};

export { upload, uploadToBlob };