import { Strategy } from "passport-local";
import { db } from "../db/db";
import argon2 from "argon2";

export const AuthLocalStrategy = new Strategy(
  { usernameField: "email", passwordField: "password" },
  async function verify(email, password, cb) {
    try {
      const [result] = await db.query<{ password: string } & Express.User>(
        "SELECT * FROM `CS317-bldr-users` WHERE email = ?",
        [email],
      );
      if (result.length <= 0) {
        return cb(false, false, { message: "Incorrect E-mail" });
      }

      const valid_password = await argon2.verify(result[0]!.password, password);

      if (!valid_password) {
        return cb(null, false, { message: "INCORRECT PASSWORD!!" });
      } else {
        return cb(null, {
          id: result[0]!.id,
          email: result[0]!.email,
          full_name: result[0]!.full_name,
        });
      }
    } catch (err) {
      return cb(err);
    }
  },
);
