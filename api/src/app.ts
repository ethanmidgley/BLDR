import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import path from "path";
import passport from "passport";
import session, { MemoryStore } from "express-session";
import fs from "fs";
import { authRouter } from "./auth/router";
import { AuthLocalStrategy } from "./auth/passport-local";
import { usersRouter } from "./users/router";
import { logsRouter } from "./logs/router";
import { postsRouter } from "./posts/router";
import { pointsRouter } from "./points/router";
import { meRouter } from "./me/router";
import { RedisStore } from "connect-redis";
import { redis } from "./db/redis";
import { __prod__ } from "./constants";

// Load environment variables for database password
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const main = async () => {
  const app = express();
  const port = 3000;

  passport.use(AuthLocalStrategy);

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "insert witty secret",
      resave: false,
      saveUninitialized: false,
      store: __prod__
        ? new RedisStore({
            client: await redis.getConnection(),
          })
        : new MemoryStore(),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(passport.authenticate("session"));

  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, { id: user.id, email: user.email, full_name: user.full_name });
    });
  });

  passport.deserializeUser(function (
    user: { id: number; email: string; full_name: string },
    cb,
  ) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });

  app.use(express.static(path.resolve(__dirname, "../static")));

  app.use("/auth", authRouter);
  app.use("/users", usersRouter);
  app.use("/logs", logsRouter);
  app.use("/posts", postsRouter);
  app.use("/points", pointsRouter);
  app.use("/me", meRouter);

  app.get("/image/:uri", async (request: Request, response: Response) => {
    const fileStream = fs.createReadStream(
      path.resolve(__dirname, "../uploads/" + request.params.uri),
    );
    fileStream.on("open", () => {
      fileStream.pipe(response);
    });
    fileStream.on("error", () => {
      response.status(404).send();
    });
  });

  app.listen(port);
};

main()
  .then(() => {
    console.log("BLDR Api Listening 🚀🚀🚀");
  })
  .catch((err) => console.error("FATAL ERROR:", err));
