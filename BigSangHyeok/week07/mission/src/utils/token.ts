const readStorageValue = (key: string) => {
    const value = localStorage.getItem(key);

    if (!value) {
        return null;
    }

    try {
        const parsed = JSON.parse(value) as unknown;

        return typeof parsed === "string" ? parsed : value;
    } catch {
        return value;
    }
};

export const getAccessToken = () => readStorageValue("accessToken");

export const getRefreshToken = () => readStorageValue("refreshToken");

export const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};
