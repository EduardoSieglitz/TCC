import styles from './home.module.css';
import NavbarFunc from '../../../components/Navbar/Funcionario/navbar_func';
import NavbarCliente from '../../../components/Navbar/Cliente/navbar_cliente';
import NavbarVisitante from '../../../components/Navbar/Visitante/navbar_visitante';
import Carrossel_image from './Carrossel_images/carrossel_image';
import Carrossel_product from './Carrosel_products/carrossel_product';
import CurtainsSection from './CurtainSection/curtain_section';

export default function Home() {
    return (
        <>
            <NavbarVisitante className={styles.navbar} />
            <Carrossel_image className={styles.carrossel_images} />
            <center className={styles.section_1}>
                <h2>Conheça nosso catálogo</h2>
            </center>

            <Carrossel_product className={styles.carrossel_product} />

            <center className={styles.section_1}>
                <CurtainsSection />
            </center>
        </>
    );
}