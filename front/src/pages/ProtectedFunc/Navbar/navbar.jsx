import React from "react";
import styles from './navbar.module.css';
import logo from '../../../img/logo_cortina.png';
import user_image from '../../../img/user_profile.png';
import { NavLink } from 'react-router-dom';
import { IoMenu, IoClose } from 'react-icons/io5';

export default function Navbar() {
    return (
        <header className={styles.headerfunc}>
            <nav className={styles.navbar}>
                <NavLink to="/homefunc">
                    <img src={logo} alt="" className={styles.logo} />
                </NavLink>

                <ul className={styles.menu_items}>
                    <NavLink to="/homefunc" className={styles.menu_link}>
                        <li>Início</li>
                    </NavLink>
                    <NavLink to="/tabelafuncionario" className={styles.menu_link}>
                        <li>TFunc</li>
                    </NavLink>
                    <NavLink to="/tabelacliente" className={styles.menu_link}>
                        <li>TClien</li>
                    </NavLink>
                    <NavLink to="/tabelaagendamento" className={styles.menu_link}>
                        <li>TAgenda</li>
                    </NavLink>
                    <NavLink to="/registrocliente" className={styles.menu_link}>
                        <li>RClien</li>
                    </NavLink>
                    <NavLink to="/registrofuncionario" className={styles.menu_link}>
                        <li>RFunc</li>
                    </NavLink>
                    <NavLink to="/registroagendamento" className={styles.menu_link}>
                        <li>RAgenda</li>
                    </NavLink>
                    <NavLink to="/registrocortinas" className={styles.menu_link}>
                        <li>RCortina</li>
                    </NavLink>
                </ul>

                <img src={user_image} alt="" className={styles.user_image} />

                <div className={styles.toggle_menu}>
                    <IoMenu />
                </div>
                <div className={styles.close_menu}>
                    <IoClose />
                </div>
            </nav>
        </header>
    )
}