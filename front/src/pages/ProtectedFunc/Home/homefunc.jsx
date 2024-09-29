import { useNavigate, Link } from 'react-router-dom'; 
import { useAuth } from '../../../context/AuthProvider/useAuth';
import styles from "./home.module.css";

export default function Home() {
    const auth = useAuth();
    const navigate = useNavigate();

    function Sair() {
        auth.logout();
        navigate("/");
    }

    return (
        <div className={styles.bodyHome_Func}>
            <h1>Acesso liberado para Funcionario</h1>
            <button onClick={Sair}>Fazer o logout</button>
            <div>
                <Link to='/tabelafuncionario'>Tabela do Funcionario</Link>
                <Link to='/tabelacliente'>Tabela do Cliente</Link>
                <Link to='/registrocliente'>Registrar Cliente</Link>
                <Link to='/registrofuncionario'>Registrar Funcioario</Link>
            </div>
        </div>
    );
}
