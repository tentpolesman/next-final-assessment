import React, { useContext } from 'react';
import Head from 'next/head'
import styled from '@emotion/styled';
import { useMutation, useQuery, gql } from "@apollo/client";
import { withApollo } from "../../lib/apollo";
import Loading from '../Loading';
import { AppContext } from '../../context/AppContext'

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

// Create Empty Cart Mutation 
const CREATE_EMPTY_CART = gql`
    mutation GenerateToken {
        createEmptyCart
    } 
`;
// End 

// Add Product To Cart Mutation
const ADD_PRODUCT_TO_CART = gql`
    mutation AddProductToCart($cart_id: String!, $sku: String!, $quantity: Float!) {
        addSimpleProductsToCart(
            input: {
                cart_id: $cart_id
                cart_items: {
                    data: {
                        sku: $sku
                        quantity: $quantity
                    }
                }
            }
        ) {
            cart {
                id        
            }
        }
    }

`
// End 

const ProductDetail = (props) => {

    const [cartId, setCartId] = useContext(AppContext);
    const [generateToken] = useMutation(CREATE_EMPTY_CART);
    const [addProductToCart] = useMutation(ADD_PRODUCT_TO_CART);

    const params_key = props.resolver.canonical_url.replace(".html", "");
    const { loading: loadingProductDetail, error: errorProductDetail, data: dataProductDetail } = useQuery(PRODUCT_DETAIL, {
        variables: { url_key: params_key },
        fetchPolicy: 'no-cache'
    });
    
    if (loadingProductDetail) {
        return <Loading />;
    }
    
    const product = dataProductDetail.products.items[0];

    const handleClick = async (sku) => {
        if(!cartId) {
            const {data: {createEmptyCart}} = await generateToken();
            setCartId(createEmptyCart);
            const cartData = await addProductToCart({
                variables: {
                    cart_id: createEmptyCart,
                    sku,
                    quantity: 1
                }
            });
            cartData ? alert("Berhasil") : alert("Gagal");
        }
        if(cartId) {
            const cartData = await addProductToCart({
                variables: {
                    cart_id: cartId,
                    sku,
                    quantity: 1
                }
            });
            cartData ? alert("Berhasil") : alert("Gagal");
        }
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
                        <button onClick={()=> handleClick(product.sku)}>Add To Cart (Simple & Downloadable Only)</button>
                    </div>
                </div>
            </ProductContainer>
        </>
    )
}
export default withApollo({ ssr: true })(ProductDetail);
