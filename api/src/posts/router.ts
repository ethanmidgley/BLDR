import express, { Request, Response } from "express";
import { isLoggedIn } from "../middleware/is-logged-in";
import { db } from "../db/db";
import { enforceIntQuery } from "../utils/utils";
import { upload } from "../multer";
export const postsRouter = express.Router();

postsRouter.post(
  "/",
  isLoggedIn,
  upload.single("image"),
  async (request: Request, response: Response) => {
    const { title, description, date, climb_id } = request.body;

    if (!request.file) {
      response.status(400).send({ error: "no file uploaded" });
      return;
    }

    try {
      const [result] = await db.execute(
        "INSERT INTO `CS317-bldr-posts` (`user_id`,`title`,`image`,`description`,`date`,`climb_id`) VALUES (?,?,?,?,?,?);",
        [
          request.user!.id,
          title,
          request.file.filename,
          description,
          date,
          climb_id,
        ],
      );
      response.json({
        data: {
          user: {
            id: result.insertId,
            user_id: request.user!.id,
            title: title,
            image: request.file.filename,
            description: description,
            date: date,
            climb_id: climb_id,
          },
        },
      });
    } catch (error) {
      console.log(error);
      response.status(500).send({ error: "Failed to create post" });
      return;
    }
  },
);
postsRouter.get(
  "/",
  isLoggedIn,
  async (request: Request, response: Response) => {
    const next_cursor = enforceIntQuery(request.query.next_cursor, 2147483647);
    const limit = enforceIntQuery(request.query.limit, 20);

    const result = [];

    try {
      const [posts] = await db.query(
        "SELECT cbp.id, cbp.user_id, cbp.title, cbp.image, cbp.date, cbp.description, cbu.full_name as full_name, cbc.time, cbc.`level`, cbc.lat, cbc.lon, cbc.type, cbc.height FROM `CS317-bldr-posts` cbp LEFT JOIN `CS317-bldr-users` cbu on cbp.user_id = cbu.id LEFT JOIN `CS317-bldr-climbs` cbc on cbp.climb_id = cbc.id WHERE cbp.id <= ? ORDER BY cbp.date DESC, cbp.id DESC LIMIT ?;",
        [next_cursor, limit + 1],
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

postsRouter.get(
  "/:id/comments",
  isLoggedIn,
  async (request: Request, response: Response) => {
    const post_id = parseInt(request.params.id || "") || -1;

    if (post_id == -1) {
      response.status(500).send({ error: "Failed" });
    }

    const next_cursor = enforceIntQuery(request.query.next_cursor, 2147483647);
    const limit = enforceIntQuery(request.query.limit, 3);

    try {
      const [comments] = await db.query<{
        id: number;
        author: string;
        date: string;
        content: string;
      }>(
        "SELECT cbc.id, cbu.full_name as author, cbc.date, cbc.content FROM `CS317-bldr-comments` cbc LEFT JOIN `CS317-bldr-users` cbu ON cbu.id = cbc.user_id WHERE cbc.post_id = ? AND cbc.id <= ? ORDER BY cbc.id DESC LIMIT ?",
        [post_id, next_cursor, limit + 1],
      );

      response.json(
        comments.length == 1 || comments.length <= limit
          ? { next_cursor: null, comments: comments }
          : {
              next_cursor: comments.pop()?.id || null,
              comments: comments,
            },
      );
    } catch (err) {
      console.log(err);
      response.status(500).send({ error: "Failed" });
      return;
    }
  },
);

postsRouter.post(
  "/:id/comments",
  isLoggedIn,
  async (request: Request, response: Response) => {
    const post_id = parseInt(request.params.id || "") || -1;

    if (post_id == -1) {
      response.status(400).send({ error: "Post not found" });
    }

    console.log(post_id);
    const { date, content } = request.body;
    console.log(date);
    console.log(content);
    try {
      const [result] = await db.execute(
        "INSERT INTO `CS317-bldr-comments` (`user_id`, `date`, `content`, `post_id`) VALUES (?, ?, ?, ?);",
        [request.user!.id, date, content, post_id],
      );

      response.json({
        data: {
          id: result.insertId,
          user_id: request.user!.id,
          date: date,
          content: content,
          post_id: post_id,
        },
      });
    } catch (error) {
      console.error("Error inserting comment:", error);
      response.status(500).json({ error: "Unable to post comment" });
    }
  },
);
