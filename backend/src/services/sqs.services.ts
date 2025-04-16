import { ISqsMessage } from '../schemas/sqs.schema';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
});

export const sendToSQS = async (message: ISqsMessage): Promise<void> => {
  const params = {
    MessageBody: JSON.stringify(message),
    QueueUrl: process.env.SQS_QUEUE_URL!,
  };

  try {
    const command = new SendMessageCommand(params);
    await sqsClient.send(command);
    console.log(`✅ SQS Message Sent: ${message.id}`);
  } catch (error) {
    console.error('❌ Error sending message to SQS:', error);
  }
};
