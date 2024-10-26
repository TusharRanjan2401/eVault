require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());
const dbConfig = require("./config/dbConfig");
const usersRoute = require("./routes/usersRoute");
const transactionsRoute = require("./routes/transactionsRoute");
const requestsRoute = require("./routes/requestsRoute");

const { connectProducer, runConsumer } = require("./service/kafkaService");

app.use("/api/users", usersRoute);
app.use("/api/transactions", transactionsRoute);
app.use("/api/requests", requestsRoute);

const PORT = process.env.PORT || 5000;

const initKafka = async () => {
  try {
    await connectProducer();
    await runConsumer();
  } catch (error) {
    console.error("Error initializing Kafka:", error);
  }
};

initKafka();

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
