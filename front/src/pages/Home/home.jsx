<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider/useAuth';

export default function Home() {
    const auth = useAuth();
    const navigate = useNavigate();
    function Sair(){
        navigate("/")
        auth.logout();
    }
    return (
        <>
            <h1>Acesso liberado</h1>
            <button onClick={() => { Sair()}}>Fazer o logaut</button>
        </>
    )
=======
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider/useAuth';

export default function Home() {
    const auth = useAuth();
    const navigate = useNavigate();
    function Sair(){
        navigate("/")
        auth.logout();
    }
    return (
        <>
            <h1>Opa</h1>
            <button onClick={() => { Sair()}}>Sair</button>
        </>
    )
>>>>>>> 6dbf4c6b16e8b5989c05440ecbbacf19dc1fb578
}