import styles from './navbar.module.css';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaXmark } from 'react-icons/fa6';
import Cadastro from '../../pages/Liberada/Cadastro/cadastro'; // Importe o componente de Cadastro
import { useAuth } from '../../context/AuthProvider/useAuth';

export default function NavbarCliente() {
    const [isOpen, setIsOpen] = useState(false);
    const [showCadastro, setShowCadastro] = useState(false); // Novo estado

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleCadastro = () => {
        setShowCadastro(!showCadastro);
    };

    const auth = useAuth();
    const navigate = useNavigate();
    function Sair() {
        navigate("/")
        auth.logout();
    }
    return (
        <header>
            <nav className={styles.navbar}>
                <NavLink to="/home" className={styles.menu_logo}>
                    <h2 className={styles.logo}>Dream Curtains</h2>
                </NavLink>

                <ul className={styles.menu_link}>
                    <NavLink to="/home" className={styles.menu_items}>
                        <li>Início</li>
                    </NavLink>
                    <NavLink to="#" className={styles.menu_items}>
                        <li>Produtos</li>
                    </NavLink>
                    <NavLink to="#" className={styles.menu_items}>
                        <li>Informações</li>
                    </NavLink>
                    <NavLink to="/encomendar" className={styles.menu_items}>
                        <li>Encomendar</li>
                    </NavLink>
                </ul>

                <button onClick={toggleCadastro} className={styles.action_btn}>
                    Criar Conta
                </button>
                <button onClick={() => { Sair() }} className={styles.action_btn}>
                    Sair
                </button>

                <div className={styles.menu_icon} onClick={toggleMenu}>
                    {isOpen ? <FaXmark /> : <FaBars />}
                </div>
            </nav>

            <div className={`${styles.dropdown_menu} ${isOpen ? styles.open : ''}`}>
                <NavLink to="#" className={styles.dropdown_menu_items}>
                    <li>Início</li>
                </NavLink>
                <NavLink to="#" className={styles.dropdown_menu_items}>
                    <li>Produtos</li>
                </NavLink>
                <NavLink to="#" className={styles.dropdown_menu_items}>
                    <li>Informações</li>
                </NavLink>
                <NavLink to="#" className={styles.dropdown_menu_items}>
                    <li>Encomendar</li>
                </NavLink>

                <li>
                    <button onClick={toggleCadastro} className={styles.action_btn}>
                        Criar Conta
                    </button>
                </li>

            </div>

            {showCadastro && <Cadastro />}
        </header>
    )
}