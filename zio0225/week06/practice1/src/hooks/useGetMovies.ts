// src/hooks/useGetMovies.ts
import { useQuery } from '@tanstack/react-query';
import { fetchMovies } from '../apis/movie';
import type { Movie } from '../types/movie';

export const useGetMovies = (category: string) => {
    return useQuery<Movie[]>({
        queryKey: ['movies', category],
        queryFn: () => fetchMovies(category),
        // 필요에 따라 staleTime 등을 설정할 수 있어요! ㅡㅡ
    });
};