import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider/useAuth';
import styles from "./home.module.css"

export default function Home() {
    const auth = useAuth();
    const navigate = useNavigate();
    function Sair(){
        navigate("/");
        auth.logout();
    }
    return (
        <body className={styles.body}>
            <h1>Acesso liberado para Funcionario</h1>
            <button onClick={() => { Sair()}}>Fazer o logout</button>
            <a href='tabelafuncionario'>Funcionario</a>
        </body>
    )
}