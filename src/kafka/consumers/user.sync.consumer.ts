import { consumer } from "../../config/kafka";
import { syncUserToElasticsearch } from "../../elastic-search/services/user.sync";


export const startUserSyncConsumer = async () => {

  await consumer.subscribe({
    topic: "user.search.sync",
    fromBeginning: true,
  });

  await consumer.run({

    eachMessage: async ({ message }) => {

      try {

        const value = JSON.parse(
          message.value?.toString() || "{}"
        );

        await syncUserToElasticsearch(value.userId);

      } catch (error) {
        console.error("Kafka consumer error",error);
      }
    },
  });
};