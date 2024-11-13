import axios from 'axios';
import dotenv from "dotenv";
import { TMDB_API_KEY } from '../config';
dotenv.config();

//request wrapper for TMDB API
const getWrapper = async (uri: string) => {
  const response = await axios.get(
    `https://api.themoviedb.org/3${uri}&api_key=${TMDB_API_KEY}`,
    {
        headers: {
            'accept': 'application/json',
        }
    }

  );
  // sort response data by results[].popularity
  return response;
};

export { getWrapper };