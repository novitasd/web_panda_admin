import { createContext, useContext, useEffect, useState } from "react";

import { login as loginService } from "../services/auth.service";

import {
    getToken,
    getUser,
    saveToken,
    saveUser,
    clearAuth,
} from "../utils/storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getUser());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();

        if (token && user) {
            setLoading(false);
            return;
        }

        clearAuth();
        setLoading(false);

    }, []);

    async function login(credentials) {
        const data = await loginService(credentials);

        saveToken(data.accessToken);
        saveUser(data.user);

        setUser(data.user);
    }

    function logout() {
        clearAuth();
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}