import { Kafka } from "kafkajs";
import dotenv from "dotenv";
dotenv.config();

export const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID as string,

  brokers: [
    process.env.KAFKA_BROKER as string
  ],
});

export const producer = kafka.producer();

export const consumer = kafka.consumer({
  groupId: "user-search-group",
});