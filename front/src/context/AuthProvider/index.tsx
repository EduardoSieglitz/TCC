import React, { createContext, useState } from "react";
import { IAuthProvider, IContext, IUser } from "./types"
import { LoginRequest, setUserLocalStorage } from "./util";

export const AuthContext = createContext<IContext>({} as IContext)

export const AuthProvider = ({ children }: IAuthProvider) => {
    const [user, setUser] = useState<IUser | null>()


    async function authenticate(email: string, senha: string) {
        const response = await LoginRequest(email, senha)

        const payload = { token: response.token, email }
        setUser(payload);
        setUserLocalStorage(payload);
    }
    function logout() {
        setUser(null);
        setUserLocalStorage(null);
    }

    return (
        <AuthContext.Provider value={{ ...user, authenticate, logout }}>
            {children}
        </AuthContext.Provider>
    )
}