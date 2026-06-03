import { Navigate, Route, Routes } from 'react-router-dom'

import './App.css'

import { HomePage } from './components/HomePage'
import { MovieDetailPage } from './components/MovieDetailPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies/:movieId" element={<MovieDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
