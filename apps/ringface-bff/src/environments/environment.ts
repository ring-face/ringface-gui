export const environment = {
  production: false,
  ringConnectorBaseUrl: "http://localhost:5000",
  ringRecogniserBaseUrl: "http://localhost:5001"
};

export const dirStructure = {
  dataDir: process.env.DATA_DIR,
  unprocessedDir: `${process.env.DATA_DIR}/events/unprocessed`,
  processedDir: `${process.env.DATA_DIR}/events/processed`,
  classifier: `${process.env.DATA_DIR}/classifier`,
  imagesDir: `${process.env.DATA_DIR}/images`,

}
