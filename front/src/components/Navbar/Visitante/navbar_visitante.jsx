import styles from './navbar_visitante.module.css';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaXmark } from 'react-icons/fa6';
import Cadastro from '../../../pages/Liberada/Cadastro/cadastro';
import Login from '../../../pages/Liberada/Login/login';

export default function NavbarVisitante() {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showCadastro, setShowCadastro] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleLogin = () => {
        // Se a tela de login já estiver visível, feche-a
        if (showLogin || showCadastro) {
            setShowLogin(false);
            setShowCadastro(false);
        } else {
            setShowLogin(true);
            setShowCadastro(false);
        }
    };

    const toggleCadastro = () => {
        setShowCadastro(true);
        setShowLogin(false);
    };

    const toggleBackToLogin = () => {
        setShowLogin(true);
        setShowCadastro(false);
    };

    return (
        <header className={styles.header}>
            <nav className={styles.navbar}>
                <h2 className={styles.logo}>
                    <NavLink to="/" className={styles.menu_logo}>
                        Dream Curtains
                    </NavLink>
                </h2>

                <ul className={styles.menu_link}>
                    <li className={styles.menu_items}>
                        <NavLink to="#" className={styles.item_link}>
                            Início
                        </NavLink>
                    </li>
                    <li className={styles.menu_items}>
                        <NavLink to="#" className={styles.item_link}>
                            Produtos
                        </NavLink>
                    </li>
                    <li className={styles.menu_items}>
                        <NavLink to="#" className={styles.item_link}>
                            Informações
                        </NavLink>
                    </li>
                    <li className={styles.menu_items}>
                        <NavLink to="#" className={styles.item_link}>
                            Encomendar
                        </NavLink>
                    </li>
                </ul>

                <button onClick={toggleLogin} className={styles.action_btn}>
                    Entrar
                </button>

                <div className={styles.menu_icon} onClick={toggleMenu}>
                    {isOpen ? <FaXmark /> : <FaBars />}
                </div>
            </nav>

            <div className={`${styles.dropdown_menu} ${isOpen ? styles.open : ''}`}>
                <li className={styles.dropdown_menu_items}>
                    <NavLink to="#" className={styles.item_link}>
                        Início
                    </NavLink>
                </li>
                <li className={styles.dropdown_menu_items}>
                    <NavLink to="#" className={styles.item_link}>
                        Produtos
                    </NavLink>
                </li>
                <li className={styles.dropdown_menu_items}>
                    <NavLink to="#" className={styles.item_link}>
                        Informações
                    </NavLink>
                </li>
                <li className={styles.dropdown_menu_items}>
                    <NavLink to="#" className={styles.item_link}>
                        Encomendar
                    </NavLink>
                </li>

                <li className={styles.dropdown_menu_items}>
                    <button onClick={toggleLogin} className={styles.action_btn}>
                        Entrar
                    </button>
                </li>
            </div>

            {showLogin && <Login toggleCadastro={toggleCadastro} />}
            {showCadastro && <Cadastro toggleLogin={toggleBackToLogin} />}
        </header>
    );
}