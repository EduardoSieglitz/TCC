import React from "react";
import styles from './navbar.module.css';
import logo from '../../../img/logo_cortina.png';
import user_image from '../../../img/user_profile.png';
import { NavLink } from 'react-router-dom';
import { IoMenu, IoClose } from 'react-icons/io5';

export default function Navbar() {
    return (
        <header>
            <nav className={styles.navbar}>
                <NavLink to="/">
                    <img src={logo} alt="" className={styles.logo} />
                </NavLink>

                <ul className={styles.menu_items}>
                    <NavLink to="/" className={styles.menu_link}>
                        <li>Início</li>
                    </NavLink>
                    <NavLink to="/produtos" className={styles.menu_link}>
                        <li>Produtos</li>
                    </NavLink>
                    <NavLink to="/informacoes" className={styles.menu_link}>
                        <li>Informações</li>
                    </NavLink>
                    <NavLink to="/encomendar" className={styles.menu_link}>
                        <li>Encomendar</li>
                    </NavLink>
                    <NavLink to="/chatClien" className={styles.menu_link}>
                        <li>Chat</li>
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