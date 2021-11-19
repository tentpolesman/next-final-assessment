import React from 'react'
import Link from "next/link";
import styles from '../styles/Home.module.css'
import NoImage from '../assets/image/no-image.jpg'

const CategoryList = (props) => {
    const category = props.ctg;
    return (
        <>
          <Link href="/[category]" as={`/${category.url_key}`}>
            <div className={styles.card}>
              <img src={category.image != null ? category.image : NoImage.src} style={{ width: "100%" }} alt="image"/>
              <h2>{category.name}</h2>
            </div>
          </Link>
        </>
    )
}

export default CategoryList
