// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import * as moviesService from "./service/requests";
import { MongoClient, ServerApiVersion } from "mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { authenticateJWT } from "./middleware/auth";
import { JWT_SECRET, PORT } from "./config";
import { createUsersCollection } from "./lib/schemas";
import { Movie } from "./interfaces/movie";
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
const database = client.db("movie-recommend");
(async () => {
  try {
    await client.connect();
    await createUsersCollection(database);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
})();
const app: Express = express();
const movies = database.collection("movies");
const rating = database.collection("rating");
const users = database.collection("users");
app.use(express.json());
app.get(["/", "/api"], (_req: Request, res: Response) => {
  //list all available routes
  res.json({
    routes: [
      "/api/movies",
      "/api/search",
      "/api/similar",
      "/api/rate",
      "/api/register",
      "/api/login",
    ],
  });
});
function cacheMovieToDb(movie: Movie) {
  movies.findOne({ id: movie.id }).then((result) => {
    if (!result) {
      movies.insertOne(movie);
    }
  });
}
function searchMovies(query: string) {
  // find movies by title or original_title
  return movies
    .find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { original_title: { $regex: query, $options: "i" } },
      ],
    })
    .toArray();
}
app.get("/api/movies", async (_req: Request, res: Response) => {
  try {
    movies
      .find()
      .toArray()
      .then((result: any) => res.json(result))
      .catch((err: any) => res.status(500).send(err));
  } catch (error) {
    res.status;
  }
});
app.get("/api/search", async (req: Request, res: Response) => {
  const query = req.query.query as string;
  if (!query) {
    return res.status(400).send("Missing query parameter");
  }
  const movies = await searchMovies(query);
  if (movies.length === 0) {
    const movies = await moviesService.searchMovies(query);
    movies.forEach(cacheMovieToDb);
    return res.json(movies);
  } else {
    return res.json(movies.map(({ _id, ...rest }) => rest));
  }
});
app.get("/api/similar", async (req: Request, res: Response) => {
  const movieId = parseInt(req.query.movieId as string);
  const movies = await moviesService.getSimilarMovies(movieId);
  res.json(movies);
});
// Rate a movie
app.get("/api/rate", authenticateJWT, async (req: Request, res: Response) => {
  const username = (req as any).user.username;
  const userRatings = await rating.find({ username }).toArray();
  // omit the _id field
  const ratings = userRatings.map(({ _id, ...rest }) => rest);
  res.json(ratings);
});
app.post("/api/rate", authenticateJWT, async (req: Request, res: Response) => {
  const { movieId, score } = req.body;
  const username = (req as any).user.username;

  const user = await users.findOne({ username });
  if (!user) {
    return res.status(400).send("User not found");
  }
  if (score < 1 || score > 10 || isNaN(score)) {
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
  return;
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

app.get("/api/img/:uri", async (req: Request, res: Response) => {
  const uri = req.params.uri;
  return res.redirect(`https://image.tmdb.org/t/p/w500/${uri}`);
});

// User login
app.post("/api/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await users.findOne({ username });
  if (!user) {
    return res.status(400).send("Invalid username or password");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid username or password");
  }

  const token = jwt.sign(
    { _id: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: "200h" }
  );
  res.header("Authorization", `Bearer ${token}`).send("Logged in successfully");
  return token;
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
