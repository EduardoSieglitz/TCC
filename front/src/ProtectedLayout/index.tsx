import React from 'react';
import { useAuth } from '../context/AuthProvider/useAuth';

export const ProtectedLayout = ({ children }: { children: JSX.Element }) => {
   const auth = useAuth();
    if (auth.token == false || auth.dados != "Clien") {
        return <center><br /><br /><br /><h1>Você não tem acesso</h1></center>;
    }
    return children;
}

export const ProtectedLayoutFunc = ({ children }: { children: JSX.Element }) => {
    const auth = useAuth();
     if (auth.token == false || auth.dados != "Func") {
         return <center><br /><br /><br /><h1>Você não tem acesso</h1></center>;
     }
     return children;
 }

 export const ProtectedLayoutSenha = ({ children }: { children: JSX.Element }) => {
    const auth = useAuth();
     if ( auth.senha != "Email enviado com sucesso!") {
         return <center><br /><br /><br /><h1>Você não tem acesso</h1></center>;
     }
     return children;
 }