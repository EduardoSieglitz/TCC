<<<<<<< HEAD
import React, { createContext, useEffect, useState } from "react";
import { IAuthProvider, IContext, IUser } from "./types"
import { getUserLocalStorage, LoginRequest, setUserLocalStorage } from "./util";

export const AuthContext = createContext<IContext>({} as IContext)

export const AuthProvider = ({ children }: IAuthProvider) => {
    const [user, setUser] = useState<IUser | null>()
    useEffect(() => {
        const user = getUserLocalStorage()
        if (user) {
            setUser(user);
        }
    }, []);

    async function authenticate(email: string, senha: string) {
        const response = await LoginRequest(email, senha);
        const payload = {token : response.token , emailback : response.usuario[0].email, email, senhaback : response.usuario[0].senha, senha};
        console.log(payload);
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
=======
import React, { createContext, useEffect, useState } from "react";
import { IAuthProvider, IContext, IUser } from "./types"
import { getUserLocalStorage, LoginRequest, setUserLocalStorage } from "./util";

export const AuthContext = createContext<IContext>({} as IContext)

export const AuthProvider = ({ children }: IAuthProvider) => {
    const [user, setUser] = useState<IUser | null>()
    useEffect(() => {
        const user = getUserLocalStorage()
        if (user) {
            setUser(user);
        }
    }, []);

    async function authenticate(email: string, senha: string) {
        const response = await LoginRequest(email, senha)
        const payload = { token: response.token, email, usuario: response.usuario[0].email };
        console.log(payload)
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
>>>>>>> 6dbf4c6b16e8b5989c05440ecbbacf19dc1fb578
}