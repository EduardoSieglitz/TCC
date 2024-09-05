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
}