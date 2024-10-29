import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider/useAuth';
import styles from "./home.module.css";
import NavbarCliente from '../../../components/NavbarCliente/navbar';
export default function Home() {
    const auth = useAuth();
    const navigate = useNavigate();
    function Sair() {
        auth.logout();
        navigate("/");
    }

    return (
        <>
            <NavbarCliente />
            <div className={styles.bodyHome_Func}>
            <br /><br /><br /><br />
                <h1>Acesso liberado para Funcionario</h1>
                <button onClick={Sair}>Fazer o logout</button>
                <div>
                    
                </div>
            </div>
        </>
    );
}
