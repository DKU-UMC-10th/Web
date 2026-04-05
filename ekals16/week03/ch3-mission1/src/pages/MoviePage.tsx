import { useEffect, useState } from "react"
import axios from "axios";
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";

export default function MoviePage() {

    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        // async를 바로 붙이면 안되고 fetchMovies라는 함수를 만들어서 그 안에 async를 붙여야 한다.
        const fetchMovies = async () => {
            // response안에 구조분해할당 해서 data를 바로 꺼내올 수 있다.
            const {data} = await axios.get<MovieResponse>(
                'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
                {
                    // headers도 작성해야 정상적으로 데이터를 받아올 수 있다.
                    headers: {
                        Authorization: 'Bearer ' + import.meta.env.VITE_TMDB_KEY,
                    }
                }
            );
            setMovies(data.results);

            /*const response = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=' + import.meta.env.VITE_TMDB_KEY);
            const data = await response.json();
            // 또한, fecth를 하게되면 실질적인 데이터 값은 response가 아니라 response.json()이기 때문에, 풀어주는 과정이 필요하다. 
            console.log(data);*/
        }
        fetchMovies();
    }, []);
    // movies안에 type이 지정이 되어있지 않으므로, type으로 movie.ts를 통해 type 지정해주기

    return (
        <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    )
}