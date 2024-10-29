import styles from './curtain_section.module.css';
import curtainsImage from '../../../../img/img_cortina_home1.jpg';

function CurtainsSection() {
    return (
        <section className={styles.sectionContainer}>
            <div className={styles.imageContainer}>
                <img src={curtainsImage} alt="Cortina" className={styles.image} />
            </div>
            <div className={styles.textContainer}>
                <h2>A importância das cortinas</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi gravida libero nec velit.
                    Morbi scelerisque luctus velit. Etiam dui sem, fermentum vitae, sagittis id, malesuada in, quam.
                    Proin mattis lacinia justo. Vestibulum facilisis auctor urna. Aliquam in lorem sit amet leo
                    accumsan lacinia. Integer rutrum, orci vestibulum ullamcorper ultricies, lacus quam ultricies
                    odio, vitae placerat pede sem sit amet enim. Phasellus et lorem id felis nonummy placerat. Fusce
                    dui leo, imperdiet in, aliquam sit amet, feugiat eu, orci.
                </p>
            </div>
        </section>
    );
}

export default CurtainsSection;