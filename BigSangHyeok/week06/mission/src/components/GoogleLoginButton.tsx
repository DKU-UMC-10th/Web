const API_URL = import.meta.env.VITE_SERVER_API_URL ?? "http://localhost:8000";

const GoogleLoginButton = () => {
    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/v1/auth/google/login`;
    };

    return (
        <button type="button" onClick={handleGoogleLogin} className="google-login-button">
            Google로 계속하기
        </button>
    );
};

export default GoogleLoginButton;
