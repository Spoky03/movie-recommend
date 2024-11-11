// TMDB requests
import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

const getPopularMovies = async () => {
  const response = await axios.get(
    `${BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&api_key=${API_KEY}`,
    {
        headers: {
            'accept': 'application/json',
        }
    }

  );
  return response.data;
};

export { getPopularMovies };