import express, { Request, Response } from "express";
import { upload } from "../multer";
import { db } from "../db/db";
import argon2 from "argon2";
import passport from "passport";
import { IVerifyOptions } from "passport-local";

export const authRouter = express.Router();

authRouter.post(
  "/register",
  upload.single("image"),
  async (request: Request, response: Response) => {
    if (!request.file) {
      response.status(400).send({ error: "no file uploaded" });
      return;
    }

    const { email, fullname, password } = request.body;
    const hashed_password = await argon2.hash(password);

    try {
      const [result] = await db.execute(
        "INSERT INTO `CS317-bldr-users` (`full_name`, `email`, `password`,`image`) VALUES (?, ?, ?, ?);",
        [fullname, email, hashed_password, request.file.filename],
      );
      response.json({
        data: {
          user: {
            id: result.insertId,
            email: email,
            fullname: fullname,
            password: hashed_password,
            image: request.file.filename,
            bio: "",
          },
        },
      });
    } catch {
      response.status(500).send({ error: "failed to create user" });
      return;
    }
  },
);

//login endpoints
authRouter.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    (err: any, user?: Express.User | false, info?: IVerifyOptions) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401).json({ message: info!.message });
        return;
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({
          user: req.user,
        });
      });
    },
  )(req, res, next);
});
