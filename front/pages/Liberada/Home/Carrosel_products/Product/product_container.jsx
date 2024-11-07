import styles from './product_container.module.css';
import imgProduct from '../../../../../img/img_cortina_home1.jpg';

export default function Product_container() {
    return (
        <div className={styles.productContainer}>

            {/* Imagem produto */}
            <img src={imgProduct} alt="Cortina" className={styles.productImage} />

            {/* Div para informações do produto */}
            <div className={styles.productInfo}>

                {/* Título produto */}
                <h3 className={styles.productTitle}>NOME PRODUTO</h3>

                {/* Descrição produto */}
                <p className={styles.productDescription}>descrição produto</p>

                {/* Botão ler mais */}
                <a href="#"><button className={styles.readMoreBtn}>Ler mais</button></a>
            </div>
        </div>
    );
}
