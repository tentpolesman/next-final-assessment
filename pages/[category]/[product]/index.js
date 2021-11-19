import React from 'react'
import styles from '../../../styles/Home.module.css'

import { useRouter } from 'next/router'
import { useQuery, gql } from "@apollo/client";
import { withApollo } from "../../../lib/apollo";
import ProductDetail from '../../../components/ProductDetail';

const PRODUCT_DETAIL = gql`
    query Product($url_key: String) {
        products(filter: { url_key: { eq: $url_key } }) {
            items {
                url_key
                name
                description {
                    html
                }
                image {
                    url
                }
                sku 
                stock_status
                media_gallery {
                  url
                }
            }
        }
    }
`;

const index = () => {
    const router = useRouter();
    const { loading, error, data } = useQuery(PRODUCT_DETAIL, {
      variables: { url_key: router.query.product },
      // fetchPolicy: 'no-cache'
    });
  
    if (loading) {
      return <div>loading...</div>;
    }
  
    const product = data.products;
    console.log(product);
    console.log(router);
    return (
        <>
            <ProductDetail product={product.items[0]} />
        </>
    )
}
export default withApollo({ ssr: true })(index);
