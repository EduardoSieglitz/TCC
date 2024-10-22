
import React, { createContext, useEffect, useState } from "react";
import { IAuthProvider, IContext, IUser } from "./types"
import { getUserLocalStorage, LoginRequest, setUserLocalStorage, SenhaRequest } from "./util";

export const AuthContext = createContext<IContext>({} as IContext)

export const AuthProvider = ({ children }: IAuthProvider) => {
    const [user, setUser] = useState<IUser | null>()
    useEffect(() => {
        const user = getUserLocalStorage();
        if (user) {
            setUser(user);
        }
    }, []);

    async function authenticate(email: string, senha: string) {
        const response = await LoginRequest(email, senha);
        const payload = { token: response.token, email, dados: response.dados[0].nivelUser };
        setUser(payload);
        setUserLocalStorage(payload);
    }

    async function requestReset(email: string) {
        const response = await SenhaRequest(email);
        const payload = { senha: response, email };
        setUser(payload);
        setUserLocalStorage(payload);
    }

    function logout() {
        setUser(null);
        setUserLocalStorage(null);
    }

    return (
        <AuthContext.Provider value={{ ...user, authenticate, logout, requestReset }}>
            {children}
        </AuthContext.Provider>
    )
}