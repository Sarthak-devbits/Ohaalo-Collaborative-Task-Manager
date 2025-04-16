export interface ISqsMessage {
  id: string;
  filename: string;
  mimeType: string;
  buffer: string;
  s3Key: string;
}

export interface GroupedFiles {
  [fieldname: string]: Express.Multer.File[];
}
