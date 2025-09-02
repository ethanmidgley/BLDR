import express, { Request, Response } from "express";
import { isLoggedIn } from "../middleware/is-logged-in";
import { db } from "../db/db";
import { upload } from "../multer";
import fs from "fs/promises";
import path from "path";

export const meRouter = express.Router();

meRouter.get("/", isLoggedIn, async (request: Request, response: Response) => {
  try {
    const [result] = await db.query<{
      full_name: string;
      image: string;
      bio: string;
    }>(
      "SELECT `full_name`, `image`, `bio` from `CS317-bldr-users` where id = ?;",
      [request.user!.id],
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
});

// FIXME: It should recieve a partial updates from the body and then update according fields
meRouter.patch(
  "/",
  isLoggedIn,
  async (request: Request, response: Response) => {
    const { bio } = request.body;

    try {
      await db.execute(
        "UPDATE `CS317-bldr-users` SET `bio` = ? WHERE id = ?;",
        [bio, request.user!.id],
      );
      response.json({
        bio: bio,
      });
    } catch (error) {
      console.error("Error updating bio:", error);
      response.status(500).json({ error: "Unable to update bio" });
    }
  },
);

meRouter.patch(
  "/pfp",
  isLoggedIn,
  upload.single("image"),
  async (request: Request, response: Response) => {
    if (!request.file) {
      response.status(400).send({ error: "no file uploaded" });
      return;
    }

    try {
      const [image_uri] = await db.query<{ image: string }>(
        "SELECT image FROM `CS317-bldr-users` WHERE id = ?;",
        [request.user!.id],
      );

      if (image_uri && image_uri.length > 0) {
        const image_to_delete = image_uri[0]!.image;
        const fpath = path.resolve(
          __dirname,
          `../../uploads/${image_to_delete}`,
        );
        await fs.unlink(fpath);
      }

      const [result] = await db.execute(
        "UPDATE `CS317-bldr-users` SET `image` = ? WHERE id = ?;",
        [request.file.filename, request.user!.id],
      );

      response.json({
        data: {
          user: {
            id: result.insertId,
            image: request.file.filename,
          },
        },
      });
    } catch (error) {
      console.error("Error updating image:", error);
      response.status(400).send({ error: "Unable to change image" });
      return;
    }
  },
);
