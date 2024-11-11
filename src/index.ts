// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import * as moviesService from "./service/requests";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.get("/", (_req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/movies", async (_req: Request, res: Response) => {
  const movies = await moviesService.getPopularMovies();
  res.json(movies);
});

app.listen(PORT, () => {
  console.log(`RUNNING SERVER AT http://localhost:${PORT}`);
});