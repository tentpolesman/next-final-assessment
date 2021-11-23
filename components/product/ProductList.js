import React from 'react'
import Head from 'next/head'
import Link from "next/link";
import styles from '../../styles/Home.module.css'
import { useQuery, gql } from "@apollo/client";
import { withApollo } from "../../lib/apollo";

import Loading from '../Loading'

const PRODUCT_LIST = gql`
  query Category($url_key: String!) {
    categoryList(filters: { url_key: { eq: $url_key } }) {
      id
      name
      url_key
      products {
        items {
          name
          image {
            url
          }
          url_key
          description {
            html
          }
        }
      }
    }
  }
`;

const ProductList = (props) => {
    const params_key = props.resolver.canonical_url.replace(".html", "");
    const { loading, error, data } = useQuery(PRODUCT_LIST, {
      variables: { url_key: params_key },
      fetchPolicy: 'no-cache'
    });

    if (loading) {
      return <Loading />;
    }
  
    const products = data.categoryList[0].products.items;

    return (
        <>
          <Head>
            <title>{params_key.toUpperCase()}</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className={styles.main}>
            <div className={styles.grid}>
              {products && products.map((product, index) => 
                <Link key={index} href="/[...slug]" as={`/${product.url_key}.html`}>
                  <div className={styles.card}>
                    <img src={product.image.url} style={{ width: "100%" }} alt="image"/>
                    <h2>{product.name}</h2>
                  </div>
                </Link>
              )}
            </div>
          </main>
        </>
    )
}
export default withApollo({ ssr: true })(ProductList);
