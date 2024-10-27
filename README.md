# eVault - An online wallet application

## Overview

eVault is an online wallet application designed for high scalability. It allows users to perform transactions, manage requests, and handle user authentication efficiently. The application is built using the MERN stack with Kafka for message brokering, making it suitable for handling numerous simultaneous operations.

## Technologies Used

- Frontend: `React`
- Backend: `Node.js, Express.js`
- Database: `MongoDB`
- Message Broker: `Kafka with Zookeeper`
- Payments: `Stripe`

## Features

- User Registration & Login: Secure authentication with JWT.
- Transaction Management: Users can send and receive money.
- Request Handling: Users can request money from others.
- Highly Scalable Architecture: Utilizes Kafka for high throughput and efficient processing of requests.

## Architecture

- `Frontend`: Connects to the backend and provides the user interface.
- `Backend`: Handles API requests and processes business logic.
- `Kafka`: Acts as a message broker for handling user activities and transactions.
- `MongoDB`: Stores user data, transaction records, and requests.

## Setup and Installation

### Prerequisites

Make sure you have the following installed:

- `Docker` Desktop installed on your machine

## Docker Image

### Pulling the zookeeper image

```bash
docker run -p 2181:2181 zookeeper
```

### Pulling the Kafka image

```bash
docker run -p 9092:9092 -e KAFKA_ZOOKEEPER_CONNECT=<IP_Address>:9092 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://<IP_Address>:9092 -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 confluentinc/cp-kafka
```

### Running the Application

1. Clone the repo
   ```bash
   git clone https://github.com/TusharRanjan2401/evault.git
   ```
2. Create a `.env` File in the root. Add environment variables-

```bash
mongo_url=mongodb://mongo:27017/evault
jwt_secret=your_jwt_secret
stripe_key=your_stripe_key
KAFKA_BROKER=localhost:9092
KAFKAJS_NO_PARTITIONER_WARNING=1
```

2. Start the Application:
   For frontend-

```bash
cd client
npm start
```

For backend-

```bash
cd server
npm start
```

## Notes

- Ensure that `kafka` and `zookeepr` containers are running in `Docker` on your machine before starting the application.
- Adjust the environment variables in the `.env` file as necessary

## Author

[@Tushar Ranjan](www.github.com/TusharRanjan2401)
