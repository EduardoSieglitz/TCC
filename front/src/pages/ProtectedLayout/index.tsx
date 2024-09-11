<<<<<<< HEAD

import React from 'react';
import { useAuth } from '../../context/AuthProvider/useAuth';

export const ProtectedLayout = ({ children }: { children: JSX.Element }) => {
   const auth = useAuth();
   console.log(auth.email + " " + auth.emailback)
    if (auth.email != auth.emailback || auth.senha != auth.senhaback || auth.token != "v") {
        return <h1>Você não tem acesso</h1>;
    }
    return children;
=======
import { useAuth } from "../../context/AuthProvider/useAuth";
import React from 'react';

export const ProtectedLayout = ({ children }: { children: JSX.Element }) => {
    const auth = useAuth()
    if (!auth.token) {
        return <h1>Você não tem acesso</h1>;
    }
    return children;
>>>>>>> 6dbf4c6b16e8b5989c05440ecbbacf19dc1fb578
}