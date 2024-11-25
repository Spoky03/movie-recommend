// TMDB requests
import dotenv from "dotenv";
dotenv.config();
import * as requestWrapper from '../lib/helpers';
import { Movie } from "../interfaces/movie";



const searchMovies = async (query: string) => {
  const response = await requestWrapper.getWrapper(`/search/movie?query=${query}&pages=1&language=en-US&page=1`);
  response.data.results.sort((a: Movie, b: Movie) => b.popularity - a.popularity);
  return response.data.results;
};
const getSimilarMovies = async (movieId: number) => {
  const response = await requestWrapper.getWrapper(`/movie/${movieId}/similar?language=en-US&page=1`);
  response.data.results.sort((a: Movie, b: Movie) => b.popularity - a.popularity);
  return response.data.results;
};

export { searchMovies, getSimilarMovies };