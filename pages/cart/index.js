import React, { useEffect, useState, useContext } from 'react';
import Head from 'next/head'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import { AppContext } from '../../context/AppContext'
import { useQuery, gql } from "@apollo/client";
import { withApollo } from "../../lib/apollo";



// Get Cart Query 
const GET_CART = gql`
    query getCart($cart_id: String!){
        cart(cart_id: $cart_id){
        errorItems
        id
        items {
            prices {
            price {
                value
            }
            }
            quantity
            product {
            name
            }
        }
        total_quantity
        }
    } 
`;
// End 

const index = () => {

    const [cartId, setCartId] = useContext(AppContext);

    const { loading: loadingCart, error: errorCart, data: dataCart } = useQuery(GET_CART, {
        variables: { cart_id: cartId },
        fetchPolicy: 'network-only'
    });

    const rowsTable = [];

    if(dataCart) {
        const cartDetail = dataCart.cart;
        // console.log(cartDetail);
        cartDetail && cartDetail.items.map((item, index) => {
            rowsTable = [...rowsTable, {id: index+1, productName: item.product.name, productQty: item.quantity, productPrice: item.prices.price.value}]
        });
        console.log(rowsTable);
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'productName', headerName: 'Name', width: 130 },
        { field: 'productQty', headerName: 'Quantity', width: 130 },
        { field: 'productPrice', headerName: 'Price', width: 130 },
    ];
      
    const rows = rowsTable;

    return (
        <>
            <Head>
                <title>Cart Page</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box sx={{ flexGrow: 1, padding: "24px" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                checkboxSelection
                            />
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
export default withApollo({ ssr: true })(index);
