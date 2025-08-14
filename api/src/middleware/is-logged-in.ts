import { Request, Response, NextFunction } from "express";

export const isLoggedIn = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (request.user && request.isAuthenticated()) {
    next();
  } else {
    response.status(403).send();
  }
};
