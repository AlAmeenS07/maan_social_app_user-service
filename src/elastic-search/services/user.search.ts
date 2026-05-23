import { esClient } from "../../config/elastic.search";

type SearchUsersParams = {
    search?: string;
    status?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
}

export const searchUsersElasticsearch = async ({ search = "", status = "", from = "", to = "", page = 1, limit = 10 }: SearchUsersParams) => {

    const must: any[] = [];

    const filter: any[] = [];


    if (search?.trim()) {

        must.push({

            multi_match: {

                query: search,

                type: "bool_prefix",

                fields: [

                    "name",
                    "name._2gram",
                    "name._3gram",

                    "user_name",
                    "user_name._2gram",
                    "user_name._3gram",

                    "email",
                    "email._2gram",
                    "email._3gram",

                    "profile.bioHead",
                    "profile.bioHead._2gram",
                    "profile.bioHead._3gram",

                    "profile.location",
                    "profile.location._2gram",
                    "profile.location._3gram",
                ],
            },
        });
    }


    if (status === "active") {

        filter.push({
            term: {
                is_blocked: false,
            },
        });
    }

    if (status === "blocked") {

        filter.push({
            term: {
                is_blocked: true,
            },
        });
    }

    if (from && to) {

        filter.push({

            range: {

                createdAt: {

                    gte: from,

                    lte: to,
                },
            },
        });
    }


    const fromValue = (page - 1) * limit;

    const result = await esClient.search({

        index: "users",

        from: fromValue,

        size: limit,

        query: {

            bool: {

                must,

                filter,
            },
        },

        sort: [
            {
                createdAt: {
                    order: "desc",
                },
            },
        ],
    });


    return {
        users: result.hits.hits.map((item: any) => item._source),
        total: typeof result.hits.total === "number" ? result.hits.total : result.hits.total?.value || 0,
    };
};