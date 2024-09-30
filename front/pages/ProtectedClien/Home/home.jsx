import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider/useAuth';
import styles from "./home.module.css";
export default function Home() {

    const auth = useAuth();
    const navigate = useNavigate();
    function Sair() {
        navigate("/")
        auth.logout();
    }
    return (
        <body className={styles.bodyHome_Clien}>
            <h1>Acesso liberado para Cliente</h1>
            <button onClick={() => { Sair() }}>Fazer o logout</button>
            <div>
                <Link to='#'>Vai ser feito o resto</Link>
            </div>
        </body>
    )
}