import game_create from "./game_create.js";
import game_get from "./game_get.js";
import game_update from "./game_update.js";
import player_create from "./player_create.js";
import player_delete from "./player_delete.js";
import player_get from "./player_get.js";
import player_modify from "./player_modify.js";
import ranking_all from "./ranking_all.js";
import ranking_specific_player from "./ranking_specific_player.js";

import tournament_get from "./tournament_get.js";
import tournament_create from "./tournament_create.js";
import tournament_delete from "./tournament_delete.js";
import tournament_join from "./tournament_join.js";
import tournament_update from "./tournament_update.js";
import game_get_by_id from "./game_get_by_id.js";

/* This function is used to check if the cookie is present in the request */
function cookieChecker(request, reply, done) {
  if (!request.cookies || typeof request.cookies.token !== "string")
    return reply.status(400).send({ error: 'The "token" cookie is mandatory' });
  done();
}

export default async function (fastify, options) {
  /*****************/
  /* NOTE: Players */
  /*****************/

  fastify.post(
    "/players",
    {
      schema: {
        body: {
          type: "object",
          required: ["user_id"],
          properties: {
            user_id: { type: "integer", minimum: 1 },
          },
        },
        additionalProperties: false,
      },
    },
    player_create
  );

  fastify.get(
    "/player/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "integer" },
          },
        },
      },
    },
    player_get
  );

  fastify.patch(
    "/player/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "integer" },
          },
        },
        body: {
          type: "object",
          properties: {
            configuration: { type: "object" },
            win_count: { type: "integer", minimum: 0 },
            lose_count: { type: "integer", minimum: 0 },
            win_points: { type: "integer", minimum: 0 },
            lose_points: { type: "integer", minimum: 0 },
          },
        },
      },
    },
    player_modify
  );

  fastify.delete(
    "/player/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "integer" },
          },
        },
      },
      preValidation: cookieChecker,
    },
    player_delete
  );

  /*****************/
  /* NOTE: Ranking */
  /*****************/

  fastify.get(
    "/ranking",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            limit: { type: "integer", minimum: 1, default: 10 },
            page: { type: "integer", minimum: 1, default: 1 },
            includeTop3: { type: "boolean", default: true },
          },
        },
      },
    },
    ranking_all
  );

  fastify.get(
    "/ranking/:id",
    {
      schema: {
        params: {
          type: "object",
        },
      },
    },
    ranking_specific_player
  );

  /***************/
  /* NOTE: Games */
  /***************/

  fastify.post(
    "/games",
    {
      schema: {
        body: {
          type: "object",
          required: ["player_a_id", "player_b_id"],
          properties: {
            player_a_id: { type: "string" },
            player_b_id: { type: "string" },
          },
        },
      },
    },
    game_create
  );

  fastify.get(
    "/games",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            player: { type: "integer" },
          },
        },
        additionalProperties: false,
      },
    },
    game_get
  );

  fastify.get(
    "/games/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "integer" },
          },
        },
      },
    },
    game_get_by_id
  );

  fastify.patch(
    "/game/:id",
    {
      schema: {
        params: {
          type: 'object',
          required: ["id"],
          properties: {
            id: { type: "integer" },
          },
        },
        body: {
          type: "object",
          properties: {
            player_a_score: { type: "integer", minimum: 0 },
            player_b_score: { type: "integer", minimum: 0 },
            state: { type: "string" },
          },
        },
      },
    },
    game_update
  );

  /********************/
  /* NOTE: Tournament */
  /********************/

  fastify.get(
    "/tournament/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
      },
    },
    tournament_get
  );

  fastify.post(
    "/tournaments",
    {
      schema: {
        body: {
          type: "object",
          required: ["configuration", "players"],
          properties: {
            configuration: { type: "object" },
            players: { type: "array", items: { type: "integer" } },
          },
        },
      },
    },
    tournament_create
  );

  fastify.delete(
    "/tournament/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", minLength: 1 },
          },
        },
      },
    },
    tournament_delete
  );

  fastify.post(
    "/tournament/join",
    {
      schema: {
        body: {
          type: "object",
          required: ["player_id", "tournament_id"],
          properties: {
            player_id: { type: "integer", minimum: 0 },
            tournament_id: { type: "string", minLength: 1 },
          },
        },
      },
    },
    tournament_join
  );

  fastify.post(
    "/tournament/:id/update",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", minLength: 1 },
          },
        },
      },
    },
    tournament_update
  );
}
