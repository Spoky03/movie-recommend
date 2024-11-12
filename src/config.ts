// keep process.env variables here
const JWT_SECRET = process.env.JWT_SECRET || "";
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const DB_URI = process.env.DB_URI;
const PORT = process.env.PORT || 3000;
export { JWT_SECRET, TMDB_API_KEY, DB_URI, PORT};