import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL ||"amqp://rabbitmq");
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
}

export const publishUserCreated = async (user: { id: string; email: string; role: string }) => {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized.");
  }
  const queue = "user.created";
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(user)));
}