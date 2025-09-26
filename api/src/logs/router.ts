import express, { Request, Response } from "express";
import { isLoggedIn } from "../middleware/is-logged-in";
import { db } from "../db/db";
import { enforceIntQuery } from "../utils/utils";
export const logsRouter = express.Router();

logsRouter.post(
  "/",
  isLoggedIn,
  async (request: Request, response: Response) => {
    const { type, time, level, success, lat, lon, height, date } = request.body;

    try {
      const [result] = await db.execute(
        "INSERT INTO `CS317-bldr-climbs` (`user_id`, `type`, `time`, `level`, `success`, `lat`, `lon`, `height`, `date`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [request.user!.id, type, time, level, success, lat, lon, height, date],
      );

      response.json({
        data: {
          climb: {
            id: result.insertId,
            user_id: request.user!.id,
            type: type,
            time: time,
            level: level,
            success: success,
            lat: lat,
            lon: lon,
            height: height,
            date: date,
          },
        },
      });
    } catch (error) {
      console.log(error);
      response.status(500).send({ error: "failed to save to user log" });
      return;
    }
  },
);

logsRouter.get(
  "/",
  isLoggedIn,
  async (request: Request, response: Response) => {
    try {
      const [result] = await db.execute(
        "SELECT *, case when exists (select 1 from `CS317-bldr-posts` p where p.climb_id=c.id) then 1 else 0 end as posted FROM `CS317-bldr-climbs` c WHERE user_id = ? ORDER BY c.date DESC, c.id DESC;",
        [request.user!.id],
      );
      response.json({ data: result });
    } catch {
      response.status(500).send({ error: "failed to read user log" });
      return;
    }
  },
);
