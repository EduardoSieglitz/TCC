import styles from './carrossel_product.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import Product_container from './Product/product_container';

export default function Carrossel_products() {
    return (
        <div className={styles.carrossel_product}>
            <Swiper 
                slidesPerView="auto"
                spaceBetween={30}
                freeMode={true}
                modules={[FreeMode]}
                className={styles.slides_products}
            >
                <SwiperSlide className={styles.product_item}>
                    <Product_container />
                </SwiperSlide>
                <SwiperSlide className={styles.product_item}>
                    <Product_container />
                </SwiperSlide>
                <SwiperSlide className={styles.product_item}>
                    <Product_container />
                </SwiperSlide>
                <SwiperSlide className={styles.product_item}>
                    <Product_container />
                </SwiperSlide>
                <SwiperSlide className={styles.product_item}>
                    <Product_container />
                </SwiperSlide>
                <SwiperSlide className={styles.product_item}>
                    <Product_container />
                </SwiperSlide>
                <SwiperSlide className={styles.product_item}>
                    <Product_container />
                </SwiperSlide>
                <SwiperSlide className={styles.product_item}>
                    <Product_container />
                </SwiperSlide>
                <SwiperSlide className={styles.product_item}>
                    <Product_container />
                </SwiperSlide>
                <SwiperSlide className={styles.product_item}>
                    <Product_container />
                </SwiperSlide>
                <SwiperSlide className={styles.product_item}>
                    <Product_container />
                </SwiperSlide>
                <SwiperSlide className={styles.product_item}>
                    <Product_container />
                </SwiperSlide>
                <SwiperSlide className={styles.product_item}>
                    <Product_container />
                </SwiperSlide>
                <SwiperSlide className={styles.product_item}>
                    <Product_container />
                </SwiperSlide>
            </Swiper>
        </div>
    )
}