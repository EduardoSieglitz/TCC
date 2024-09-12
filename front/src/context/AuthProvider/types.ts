export interface IUser {
    email?: string;
    dados?: string;
    token?: boolean;
}

export interface IContext extends IUser {
    authenticate: (email: string, senha: string) => Promise<void>;
    logout: () => void;
}

export interface IAuthProvider {
    children: JSX.Element;
}
