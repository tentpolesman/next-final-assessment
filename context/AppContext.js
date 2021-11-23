import React, { useEffect, useState, createContext } from 'react';

export const AppContext = createContext();

export const AppProvider = (props) => {

    const [cartId, setCartId] = useState("");

    useEffect(() => {
        const localCartId = JSON.parse(localStorage.getItem('metalslug'))
        if(localCartId) {
            setCartId(localCartId);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('metalslug', JSON.stringify(cartId))
    }, [cartId]);

    return (
        <AppContext.Provider value={[cartId, setCartId]}>
            {props.children}
        </AppContext.Provider>
    )
}
