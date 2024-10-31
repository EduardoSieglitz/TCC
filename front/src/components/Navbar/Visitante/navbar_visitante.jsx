import styles from './navbar_visitante.module.css';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
// Importando os ícones
import { FaBars, FaXmark } from 'react-icons/fa6';
// Importando o componente de Cadastro
import Cadastro from '../../../pages/Liberada/Cadastro/cadastro';

export default function NavbarVisitante() {
    const [isOpen, setIsOpen] = useState(false);
    const [showCadastro, setShowCadastro] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleCadastro = () => {
        setShowCadastro(!showCadastro);
    };

    return (
        <header>
            <nav className={styles.navbar}>
                <NavLink to="/" className={styles.menu_logo}>
                    <h2 className={styles.logo}>Dream Curtains</h2>
                </NavLink>

                <ul className={styles.menu_link}>
                    <NavLink to="#" className={styles.menu_items}>
                        <li>Início</li>
                    </NavLink>
                    <NavLink to="#" className={styles.menu_items}>
                        <li>Produtos</li>
                    </NavLink>
                    <NavLink to="#" className={styles.menu_items}>
                        <li>Informações</li>
                    </NavLink>
                    <NavLink to="#" className={styles.menu_items}>
                        <li>Encomendar</li>
                    </NavLink>
                </ul>

                <button onClick={toggleCadastro} className={styles.action_btn}>
                    Entrar
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
                        Entrar
                    </button>
                </li>
            </div>

            {showCadastro && <Cadastro />} {/* Renderiza o componente Cadastro */}
        </header>
    )
}