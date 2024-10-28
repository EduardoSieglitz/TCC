import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider/useAuth';
import styles from "./home.module.css";
import Navbar from "../Navbar/navbar";

export default function Home() {

    const auth = useAuth();
    const navigate = useNavigate();
    function Sair() {
        navigate("/")
        auth.logout();
    }
    return (
        <>
            <Navbar></Navbar>
            <body className={styles.bodyHome_Clien}>
                <h1>Acesso liberado para Cliente</h1>
                <button onClick={() => { Sair() }}>Fazer o logout</button>
                <div>
                    <Link to='#'>Vai ser feito o resto</Link>
                </div>
            </body>
        </>
    )
}