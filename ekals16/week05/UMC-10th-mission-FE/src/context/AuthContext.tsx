import { useState, type PropsWithChildren } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { postSignin, postLogout } from '../apis/auth';
import type { RequestSigninDto } from '../types/auth';
import { LOCAL_STORAGE_KEY } from '../constants/key';
import { AuthContext } from './useAuth';

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const {
        getItem: getAccessTokenInStorage,
        setItem: setAccessTokenInStorage,
        removeItem: removeAccessTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

    const {
        getItem: getRefreshTokenInStorage,
        setItem: setRefreshTokenInStorage,
        removeItem: removeRefreshTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessToken] = useState<string | null>(getAccessTokenInStorage());
    const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshTokenInStorage());

    const login = async (signinData: RequestSigninDto) => {
        try {
            const data = await postSignin(signinData);

            if(data?.data) {
                const newAccessToken = data.data.accessToken;
                const newRefreshToken = data.data.refreshToken;

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);
                setAccessTokenInStorage(newAccessToken);
                setRefreshTokenInStorage(newRefreshToken);
                alert('로그인 성공!');
                window.location.href = "/my";
            }
        } catch (error) {
            console.error('로그인 실패:', error);
            alert('로그인 실패!');
        }
    };

    const logout = async () => {
        try {
            await postLogout();
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();
            setAccessToken(null);
            setRefreshToken(null);
            alert('로그아웃 성공!');
        } catch (error) {
            console.error('로그아웃 실패:', error);
            alert('로그아웃 실패!');
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
