// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import * as moviesService from "./service/requests";
import { MongoClient, ServerApiVersion } from "mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { authenticateJWT } from "./middleware/auth";
import { JWT_SECRET, PORT} from "./config";
const DB_URI = process.env.DB_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(DB_URI ?? "", {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
dotenv.config();
client.connect();
const app: Express = express();
const database = client.db("movie-recommend");
const movies = database.collection("movies");
const rating = database.collection("rating");
const users = database.collection("users");
app.use(express.json());
app.get("/", (_req: Request, res: Response) => {
  try {
    movies.find().toArray()
      .then((result: any) => res.json(result))
      .catch((err: any) => res.status(500).send(err));
  } catch (error) {
    res.status;
  }
});

app.get("/api/search", async (req: Request, res: Response) => {
  const query = req.query.query as string;
  const movies = await moviesService.searchMovies(query);
  res.json(movies);
});
app.get("/api/similar", async (req: Request, res: Response) => {
  const movieId = parseInt(req.query.movieId as string);
  const movies = await moviesService.getSimilarMovies(movieId);
  res.json(movies);
});
// Rate a movie
app.post("/api/rate", authenticateJWT, async (req: Request, res: Response) => {
  const { movieId, score } = req.body;
  const username = (req as any).user.username;

  const user = await users.findOne({ username });
  if (!user) {
    return res.status(400).send("User not found");
  }
  if (score < 1 || score > 5) {
    return res.status(400).send("Invalid score");
  }
  if (isNaN(movieId) || movieId === null) {
    return res.status(400).send("Invalid movieId");
  }

  const userRating = await rating.findOne({ username, movieId });
  if (userRating) {
    await rating.updateOne({ username, movieId }, { $set: { score } });
  } else {
    await rating.insertOne({ username, movieId, score });
  }
  res.send("Movie rated successfully");
  return
});
// User registration
app.post("/api/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await users.findOne({ username });
  if (user) {
    return res.status(400).send("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await users.insertOne({ username, password: hashedPassword });
  res.send("User registered successfully");
  return;
});

// User login
app.post("/api/login", async (req: Request, res: Response) => {
  console.log(req.body);
  const { username, password } = req.body;

  const user = await users.findOne({ username });
  if (!user) {
    return res.status(400).send("Invalid username or password");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid username or password");
  }

  const token = jwt.sign({ _id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
  res.header("Authorization", `Bearer ${token}`).send("Logged in successfully");
  return token;
});

// Protected route example
app.get("/api/movies2", authenticateJWT, (_req: Request, res: Response) => {
  try {
    movies.find().toArray()
      .then((result: any) => res.json(result))
      .catch((err: any) => res.status(500).send(err));
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
