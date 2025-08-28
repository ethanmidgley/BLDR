import express, { Request, Response } from "express";
import { isLoggedIn } from "../middleware/is-logged-in";
import { db } from "../db/db";
import { enforceFloatQuery } from "../utils/utils";
export const pointsRouter = express.Router();

pointsRouter.get(
  "/",
  isLoggedIn,
  async (request: Request, response: Response) => {
    const d_fall_back = 0.3;
    const d_lat = enforceFloatQuery(request.query.lat_delta, d_fall_back);
    const d_lon = enforceFloatQuery(request.query.lon_delta, d_fall_back);
    const lat = enforceFloatQuery(request.query.lat, 55.8617);
    const lon = enforceFloatQuery(request.query.lon, -4.2583);

    const lat_lower = lat - d_lat;
    const lat_upper = lat + d_lat;
    const lon_lower = lon - d_lon;
    const lon_upper = lon + d_lon;

    const result = [];

    try {
      const [posts] = await db.query<{}>(
        "SELECT cbp.id, cbp.user_id, cbp.title, cbp.image, cbp.date, cbp.description, cbu.full_name as full_name, cbc.time, cbc.`level`, cbc.lat, cbc.lon, cbc.type, cbc.height FROM `CS317-bldr-posts` cbp LEFT JOIN `CS317-bldr-users` cbu on cbp.user_id = cbu.id LEFT JOIN `CS317-bldr-climbs` cbc on cbp.climb_id = cbc.id WHERE cbc.lat >= ? AND cbc.lat <= ? AND cbc.lon >= ? AND cbc.lon <= ? ORDER BY cbp.date DESC, cbp.id DESC LIMIT ?;",
        [lat_lower, lat_upper, lon_lower, lon_upper, 20],
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
            height: post.height,
            type: post.type,
            lat: post.lat,
            lon: post.lon,
          },
        });
      }

      response.json(result);
    } catch (err) {
      console.log(err);
      response.status(500).send({ error: "Failed" });
      return;
    }
  },
);
