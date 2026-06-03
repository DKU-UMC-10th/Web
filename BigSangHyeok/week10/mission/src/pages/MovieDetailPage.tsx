import { Link, useParams } from "react-router-dom";

export default function MovieDetailPage() {
    const {movieId} = useParams();

    return (
        <main className="container detail-page">
            <Link className="back-link" to="/">Home</Link>
            <h1>Movie Detail</h1>
            <p>movieId: {movieId}</p>
        </main>
    );
}
