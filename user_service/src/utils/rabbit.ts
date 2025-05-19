import amqp from "amqplib";
import User from "../models/User";

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect("amqp://rabbitmq");
  const channel = await connection.createChannel();
  console.log("User Service: Connected to RabbitMQ");

  const queue = "user.created";
  await channel.assertQueue(queue);

  channel.consume(queue, async (msg) => {
    if (msg) {
      const userData = JSON.parse(msg.content.toString());
      console.log("User Service: Received new user:", userData);

      await User.create({
        _id: userData.id,
        email: userData.email,
        role: userData.role,
      });

      channel.ack(msg);
    }
  });
};
