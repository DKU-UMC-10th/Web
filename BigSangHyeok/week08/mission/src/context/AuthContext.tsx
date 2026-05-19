import { createContext, useContext, useState, type PropsWithChildren } from "react";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    setAuthTokens: (accessToken: string, refreshToken: string) => void;
    clearAuthTokens: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    setAuthTokens: () => {},
    clearAuthTokens: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const {
        getItem: getAccessTokenFromStorage,
        setItem: setAccessTokenInStorage,
        removeItem: removeAccessTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const {
        getItem: getRefreshTokenFromStorage,
        setItem: setRefreshTokenInStorage,
        removeItem: removeRefreshTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessToken] = useState<string | null>(getAccessTokenFromStorage());
    const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshTokenFromStorage());

    const setAuthTokens = (nextAccessToken: string, nextRefreshToken: string) => {
        setAccessTokenInStorage(nextAccessToken);
        setRefreshTokenInStorage(nextRefreshToken);
        setAccessToken(nextAccessToken);
        setRefreshToken(nextRefreshToken);
    };

    const clearAuthTokens = () => {
        removeAccessTokenFromStorage();
        removeRefreshTokenFromStorage();
        setAccessToken(null);
        setRefreshToken(null);
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, setAuthTokens, clearAuthTokens }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }

    return context;
};
