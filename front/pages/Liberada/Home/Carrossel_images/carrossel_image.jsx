import styles from './carrossel_image.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import imgHome1 from '../../../../img/img_cortina_home1.jpg';
import imgHome2 from '../../../../img/img_cortina_home2.jpg';
import imgHome3 from '../../../../img/img_cortina_home3.jpg';

export default function Carrossel_images() {
    return (
        <div className={styles.carrossel}>
            <Swiper
                slidesPerView={1}
                modules={[Pagination, Autoplay]}
                pagination={true}
                loop={true}
                speed={1000} 
                autoplay={{delay:3500, pauseOnMouseEnter: true}}
                className={styles.slide_images}
            >
                <SwiperSlide>
                    <img src={imgHome1} alt='Slider' className={styles.slide_item} />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={imgHome2} alt='Slider' className={styles.slide_item} />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={imgHome3} alt='Slider' className={styles.slide_item} />
                </SwiperSlide>
            </Swiper>
        </div>
    );
}
