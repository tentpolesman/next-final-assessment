import React from 'react'
import Link from "next/link";
import styles from '../styles/Home.module.css'

const ProductList = (props) => {
    const product = props.product;
    return (
        <>
          <Link href="/[category]/[product]" as={`/${props.category}/${product.url_key}`}>
            <div className={styles.card}>
              <img src={product.image.url} style={{ width: "100%" }} alt="image"/>
              <h2>{product.name.length > 15 ? (product.name.substring(0, 15) + "...") : product.name}</h2>
            </div>
          </Link>
        </>
    )
}

export default ProductList
