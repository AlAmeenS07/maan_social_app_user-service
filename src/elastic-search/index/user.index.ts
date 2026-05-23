import { esClient } from "../../config/elastic.search";

export const createUsersIndex = async () => {

  const exists = await esClient.indices.exists({index: "users"});

  if (exists) {
    console.log("Users index already exists");
    return;
  }

  await esClient.indices.create({

    index: "users",

    mappings: {

      properties: {

        id: {
          type: "keyword"
        },

        name: {
          type: "search_as_you_type"
        },

        user_name: {
          type: "search_as_you_type"
        },

        email: {
          type: "search_as_you_type"
        },

        is_blocked: {
          type: "boolean"
        },

        is_verified: {
          type: "boolean"
        },

        createdAt: {
          type: "date"
        },

        profile: {

          properties: {

            gender: {
              type: "keyword"
            },

            location: {
              type: "search_as_you_type"
            },

            bioHead: {
              type: "search_as_you_type"
            },

            bioText: {
              type: "text"
            }
          }
        },

        profileLinks: {

          type: "nested",

          properties: {

            title: {
              type: "keyword"
            },

            url: {
              type: "text"
            }
          }
        }
      }
    }
  });

  console.log("Users index created");
};