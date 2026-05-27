import { useState, type PropsWithChildren } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postLogout, postSignin } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import useLocalStorage from "../hooks/useLocalStorage";
import type { RequestSigninDto } from "../types/auth";
import { AuthContext } from "./useAuth";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
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

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenInStorage(),
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenInStorage(),
  );

  const clearAuth = () => {
    removeAccessTokenFromStorage();
    removeRefreshTokenFromStorage();
    setAccessToken(null);
    setRefreshToken(null);
    queryClient.removeQueries({ queryKey: ["me"] });
  };

  const loginMutation = useMutation({
    mutationFn: postSignin,
    onSuccess: (response) => {
      const newAccessToken = response.data.accessToken;
      const newRefreshToken = response.data.refreshToken;

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setAccessTokenInStorage(newAccessToken);
      setRefreshTokenInStorage(newRefreshToken);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: postLogout,
    onSuccess: clearAuth,
    onError: clearAuth,
  });

  const login = async (signinData: RequestSigninDto) => {
    try {
      await loginMutation.mutateAsync(signinData);
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다.");
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, login, logout, clearAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
