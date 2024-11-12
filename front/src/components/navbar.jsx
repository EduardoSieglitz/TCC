import Visitante from "./Navbar/Visitante/navbar_visitante";
import Cliente from "./Navbar/Cliente/navbar_cliente";
import Funcionario from "./Navbar/Funcionario/navbar_func";
import { useAuth } from "../context/AuthProvider/useAuth";

export default function Navbar() {
    const auth = useAuth();

    if (auth.dados === "Func") {
        return <Funcionario />;
    } else if (auth.dados === "Clien") {
        return <Cliente />;
    } else {
        return <Visitante />;
    }
}