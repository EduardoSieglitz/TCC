import styles from './home.module.css';
import NavbarCliente from '../../../components/NavbarCliente/navbar';
import Carrossel_image from './Carrossel_images/carrossel_image';
import Carrossel_product from './Carrosel_products/carrossel_product';
import CurtainsSection from './CurtainSection/curtain_section';
// link vídeo: https://www.youtube.com/watch?v=cux7yaycIzs

export default function Home() {
    return (
        <>
            <NavbarCliente className={styles.navbar} />
            <Carrossel_image className={styles.carrossel_images} />
            <center className={styles.section_1}>
                <h2>Conheça nosso catálogo</h2>
            </center>
            <Carrossel_product className={styles.carrossel_product} />
            <center className={styles.section_1}>
            </center>
            <CurtainsSection />
            <br />
            <br />
            <br />
        </>
    );
}