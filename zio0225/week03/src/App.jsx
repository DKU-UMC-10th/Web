import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/root-layout";
import MoviesPage from "./pages/MoviesPage";
import MovieDetailPage from "./pages/MovieDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <MoviesPage /> },
      { path: "movies/popular", element: <MoviesPage /> },
      { path: "movies/now-playing", element: <MoviesPage /> },
      { path: "movies/top-rated", element: <MoviesPage /> },
      { path: "movies/up-coming", element: <MoviesPage /> },
      { path: "movies/:movieId", element: <MovieDetailPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;