import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/root-layout";
import MoviesPage from "./pages/MoviesPage";
import MovieDetailPage from "./pages/MovieDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <MoviesPage /> }, // 기본 메인
      { path: "movies/popular", element: <MoviesPage /> },
      { path: "movies/now-playing", element: <MoviesPage /> },
      { path: "movies/top-rated", element: <MoviesPage /> },
      { path: "movies/up-coming", element: <MoviesPage /> },
      
      /* 🚀 핵심: 상세 페이지 경로를 'movie/:movieId'로 설정 */
      { path: "movie/:movieId", element: <MovieDetailPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;