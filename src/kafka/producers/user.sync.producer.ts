import { producer } from "../../config/kafka";

export const publishUserSyncEvent = async (userId: string) => {

  await producer.send({
    topic: "user.search.sync",
    messages: [
      {
        value: JSON.stringify({userId})
      },
    ],
  });
};