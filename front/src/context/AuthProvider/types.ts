export interface IUser {
    email?: string;
    dados?: {};
    token?: boolean;
    senha?: string;
    id?: string;
    idFunc?: string;
}

export interface IContext extends IUser {
    authenticate: (email: string, senha: string) => Promise<void>;
    logout: () => void;
    requestReset: (email: string) => Promise<void>;
}

export interface IAuthProvider {
    children: JSX.Element;
}
