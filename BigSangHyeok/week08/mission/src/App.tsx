import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import HomeLayout from "./layouts/HomeLayout";
import CreateLpPage from "./pages/CreateLpPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import HomePage from "./pages/HomePage";
import LpDetailPage from "./pages/LpDetailPage";
import LoginPage from "./pages/LoginPage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";
import SearchPage from "./pages/SearchPage";
import SignupPage from "./pages/SignupPage";


const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout />,
        errorElement: <NotFoundPage />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "login", element: <LoginPage /> },
            { path: "search", element: <SearchPage /> },
            { path: "signup", element: <SignupPage /> },
            { path: "google/callback", element: <GoogleCallbackPage /> },
            { path: "auth/google/callback", element: <GoogleCallbackPage /> },
            {
                element: <ProtectedRoute />,
                children: [
                    { path: "my", element: <MyPage /> },
                    { path: "lp/new", element: <CreateLpPage /> },
                    { path: "lp/:lpid", element: <LpDetailPage /> },
                    { path: "lps/:lpid", element: <LpDetailPage /> },
                ],
            },
        ],
    },
]);

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;
