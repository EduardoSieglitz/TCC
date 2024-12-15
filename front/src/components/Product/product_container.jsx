import { useState, useEffect, useRef } from 'react';
import styles from './product_container.module.css';
import { useNavigate } from 'react-router-dom';

export default function ProductContainer({ nome, imagem, modelo, idCortina }) {
    const [isButtonVisible, setIsButtonVisible] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();
    
    const handleReadMore = (idCortina) => {
        navigate(`/produto/${idCortina}`);
    };
    
    // Função para alternar a visibilidade do botão
    const toggleButton = (e) => {
        if (window.innerWidth <= 768) { // Aplica apenas para dispositivos móveis
            e.stopPropagation();
            setIsButtonVisible(!isButtonVisible);
        }
    };

    // Função para fechar o botão ao clicar fora
    const handleClickOutside = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
            setIsButtonVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div
            className={styles.productContainer}
            onClick={toggleButton}
            ref={containerRef}
        >
            <img src={imagem} alt={nome} className={styles.productImage} />

            <div className={styles.productInfo}>
                <h3 className={styles.productTitle}>{nome}</h3>
                <p className={styles.productDescription}>{modelo}</p>
                    <button
                        className={`${styles.readMoreBtn} ${isButtonVisible ? styles.visible : ''}`}
                        onClick={() => handleReadMore(idCortina)}
                    >
                        Ler mais
                    </button>
            </div>
        </div>
    );
}
