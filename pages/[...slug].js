import React from 'react'
import { useQuery,gql } from "@apollo/client";

import { withApollo } from '../lib/apollo';
import ProductList from '../components/product/ProductList';
import ProductDetail from '../components/product/ProductDetail';
import Loading from '../components/Loading';

const UrlResolver = gql`query getUrlResolver($url: String!){
    urlResolver(url: $url){
        canonical_url
        entity_uid
        id
        redirectCode
        relative_url
        type
    }
}`

const getPage = (resolver) => {
    // console.log(resolver)
    if (!resolver) {
      return <div>Page not found</div>;
    } else if (resolver.type === "CATEGORY") {
        return <ProductList resolver={resolver} />
    } 
    else if (resolver.type === "PRODUCT") {
        return <ProductDetail resolver={resolver} />
    }
    return <span />;
};

function DynamicPage({slug}) {
    // const { query } = slug;
    let url = ''
    let NewSlug = [];
    slug.slug.map((value) => {
        value = value.replace(".html", "");
        NewSlug.push(value);//masukin value kedalam array slugnya
        url += `/${value}`;
    });
    url += ".html";
    // console.log("url",NewSlug)

    const response = useQuery(UrlResolver,{
        variables:{
            url: url
        }
    })
    const {loading, error, data} = response;
    //kalau masih loading
    if (loading) {
        return (
            <Loading />
        );
    }

    if (error) {
        return <h2>Error...</h2>;
    }

    const resolver = data.urlResolver;
    return (
        <>
            {getPage(resolver)}
        </>
    )
}

export const getServerSideProps = async (context) => {
    // console.log(context)
    const url = context.query

    return {
        props:{ slug: url }
    }
}

export default withApollo({ ssr: false })(DynamicPage);
