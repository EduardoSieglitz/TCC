import { useAuth } from "../../context/AuthProvider/useAuth";
import React from 'react';

export const ProtectedLayout = ({ children }: { children: JSX.Element }) => {
    const auth = useAuth()
    if (!auth.token) {
        return <h1>Você não tem acesso</h1>;
    }
    return children;
}