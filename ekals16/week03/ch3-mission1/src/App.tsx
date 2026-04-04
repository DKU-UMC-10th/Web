import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import MoviePage from './pages/MoviePage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import MovieDetailPage from './pages/MovieDetailPage';

// BrowserRouter v5
// createBrowserRouter v6

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Navigate to="movies/popular" replace />,
      },
      {
        path: 'movies/:category',
        element: <MoviePage />
      },
      {
        path: 'movie/:movieId',
        element: <MovieDetailPage />
      }
    ]
  }
]);

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
