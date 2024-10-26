const { Kafka } = require("kafkajs");
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");
const RequestModel = require("../models/requestModel");

const kafka = new Kafka({
  clientId: "ewallet-app",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "ewallet-group" });

const connectProducer = async () => {
  await producer.connect();
  console.log("Kafka Producer connected");
};

const sendMessage = async (topic, message) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "user-activity", fromBeginning: true });
  await consumer.subscribe({ topic: "money-requests", fromBeginning: true });
  await consumer.subscribe({ topic: "transactions", fromBeginning: true });

  console.log("Kafka consumer connected");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log(`Received message from ${topic}:`, data);

      try {
        switch (topic) {
          case "user-activity":
            const existingUser = await User.findOne({ email: data.email });
            if (!existingUser) {
              const newUser = new User(data);
              await newUser.save();
              console.log(`User created: ${data.email}`);
            } else {
              console.log(`User logged in ${data.email}`);
            }
            break;
          case "money-requests":
            const request = new RequestModel({
              sender: data.userId,
              receiver: data.receiver,
              amount: data.amount,
              description: data.description,
            });
            await request.save();
            console.log(
              `${data.sender} requested ${data.receiver} amount:$${data.amount}`
            );
            break;
          case "transactions":
            const newTransaction = new Transaction(data);
            await newTransaction.save();
            console.log(
              `${data.amount} transfer from ${data.sender} to ${data.receiver}`
            );
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Error processing message from ${topic}:`, error);
      }
    },
  });
};

module.exports = { connectProducer, sendMessage, runConsumer };
