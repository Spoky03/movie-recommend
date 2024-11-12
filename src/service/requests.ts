// TMDB requests
import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

const searchMovies = async (query: string) => {
  const response = await axios.get(
    `${BASE_URL}/search/movie?query=${query}&language=en-US&page=1&api_key=${API_KEY}`,
    {
        headers: {
            'accept': 'application/json',
        }
    }

  );
  return response.data;
};

export { searchMovies };