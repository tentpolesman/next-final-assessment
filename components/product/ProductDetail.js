import React from 'react'
import Head from 'next/head'
import styled from '@emotion/styled';
import { useQuery, gql } from "@apollo/client";
import { withApollo } from "../../lib/apollo";
import Loading from '../Loading';

// Styling CSS in JS
const ProductContainer = styled.section`
    max-width: 920px;
    border-radius: 12px;
    margin: 42px auto 42px auto;
    width: 100%;
    display: flex;
    padding: 42px 0;
    .product-image {
        flex: 0 0 300px;
        img {
            width: 100%;
        }
        margin-right: 42px;
        .product-gallery {
            display: flex;
            .media-wrapper {
                flex: 1 1 100%;
                img {
                    width: 100%;
                }
            }
        }
    }
    .product-info {
        flex: 1 1 auto;
        .product-status {
            display: flex;
            align-items: center;
            h1 {
                margin: 0;
            }
            p {
                background: rgb(42, 163, 52);
                color: #fff;
                padding: 4px 8px;
                border-radius: 2px;
                font-size: 10px;
                margin: 4px 0 0 8px;
            }
        }
        h2 {
            font-size: 18px;
            margin: 12px 0;
        }
    }
    .product-description {
        padding: 2px 0 4px 0;
    }
    .button-container {
        button {
            margin-top: 6px;
            padding: 12px 16px;
            text-transform: uppercase;
            font-weight: bold;
            color: #fff;
            background: #000;
            border: 0;
            outline: 0;
            cursor: pointer;
        }
    }
`;
// End 

// Product Detail Query 
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
                price_range {
                    minimum_price {
                        regular_price {
                            value
                        }
                    }
                }
            }
        }
    }
`;
// End 

const ProductDetail = (props) => {
    const params_key = props.resolver.canonical_url.replace(".html", "");
    const { loading, error, data } = useQuery(PRODUCT_DETAIL, {
        variables: { url_key: params_key },
        fetchPolicy: 'no-cache'
      });
    
      if (loading) {
          return <Loading />;
      }
    
    const product = data.products.items[0];
    const handleClick = () => {
        alert(product.name);
    }
    return (
        <>
            <Head>
                <title>{product.name}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ProductContainer>
                <div className="product-image">
                    <img src={product.image.url} alt="image" />
                    <div className="product-gallery">
                        {product.media_gallery.length > 1 && product.media_gallery.map((media, index) => 
                            <div className="media-wrapper">
                                <img src={media.url} alt="media" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="product-info">
                    <div className="product-status">
                        <h1 dangerouslySetInnerHTML={{__html: product.name}}></h1>
                        <p><strong>{product.stock_status}</strong></p>
                    </div>
                    <h2>Rp{product.price_range.minimum_price.regular_price.value}&nbsp;&nbsp;|&nbsp;&nbsp;SKU#: {product.sku}</h2>
                    <hr />
                    <div className="product-description" dangerouslySetInnerHTML={{__html: product.description.html}}></div>
                    <hr />
                    <div className="button-container">
                        <button onClick={handleClick}>Add To Cart</button>
                    </div>
                </div>
            </ProductContainer>
        </>
    )
}
export default withApollo({ ssr: true })(ProductDetail);
