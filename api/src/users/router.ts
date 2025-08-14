import express, { Request, Response } from "express";
import { isLoggedIn } from "../middleware/is-logged-in";
import { db } from "../db/db";
import { enforceIntQuery } from "../utils/utils";
export const usersRouter = express.Router();

usersRouter.get(
  "/:id",
  isLoggedIn,
  async (request: Request, response: Response) => {
    try {
      const [result] = await db.query<{
        full_name: string;
        image: string;
        bio: string;
      }>(
        "SELECT `full_name`, `image`, `bio` from `CS317-bldr-users` where id = ?;",
        [request.params.id],
      );

      if (!result || result.length == 0) {
        response.status(404).send({ error: "failed to find user" });
        return;
      }

      response.json({
        fullname: result[0]!.full_name,
        image: result[0]!.image,
        bio: result[0]!.bio,
      });
    } catch (error) {
      console.log(error);
      response.status(500).send({ error: "failed to fetch user data" });
      return;
    }
  },
);

usersRouter.get(
  "/:id/posts",
  isLoggedIn,
  async (request: Request, response: Response) => {
    const next_cursor = enforceIntQuery(request.query.next_cursor, 2147483647);
    const limit = enforceIntQuery(request.query.limit, 20);

    const result = [];

    try {
      const [posts] = await db.query(
        "SELECT cbp.id, cbp.user_id, cbp.title, cbp.image, cbp.date, cbp.description, cbu.full_name as full_name, cbc.time, cbc.`level`, cbc.lat, cbc.lon, cbc.type, cbc.height FROM `CS317-bldr-posts` cbp LEFT JOIN `CS317-bldr-users` cbu on cbp.user_id = cbu.id LEFT JOIN `CS317-bldr-climbs` cbc on cbp.climb_id = cbc.id WHERE cbp.id <= ? AND cbu.id = ? ORDER BY cbp.date DESC, cbp.id DESC LIMIT ?;",
        [next_cursor, request.params.id, limit + 1],
      );

      for (const post of posts) {
        result.push({
          id: post.id,
          user_id: post.user_id,
          title: post.title,
          image: post.image,
          description: post.description,
          author: post.full_name,
          climb: {
            time: post.time,
            level: post.level,
            type: post.type,
            height: post.height,
            lat: post.lat,
            lon: post.lon,
          },
        });
      }

      response.json(
        result.length == 1 || result.length <= limit
          ? { next_cursor: null, posts: result }
          : {
              next_cursor: result.pop()?.id || null,
              posts: result,
            },
      );
    } catch (err) {
      console.log(err);
      response.status(500).send({ error: "Failed" });
      return;
    }
  },
);
