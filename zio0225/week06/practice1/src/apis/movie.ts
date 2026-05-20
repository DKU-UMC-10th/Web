
import axios from 'axios';
import type { Movie } from '../types/movie';

const apiKey = import.meta.env.VITE_API_KEY;

export const fetchMovies = async (category: string): Promise<Movie[]> => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${category}`, {
        params: { 
            api_key: apiKey, 
            language: 'ko-KR', 
            page: 1 
        }
    });
    return response.data.results;
};