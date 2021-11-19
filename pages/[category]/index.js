import Head from 'next/head'
import styles from '../../styles/Home.module.css'

import { useRouter } from 'next/router'
import { useQuery, gql } from "@apollo/client";
import { withApollo } from "../../lib/apollo";


import ProductList from '../../components/ProductList'

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

const Index = () => {
  const router = useRouter();
  const { loading, error, data } = useQuery(PRODUCT_LIST, {
    variables: { url_key: router.query.category },
    // fetchPolicy: 'no-cache'
  });

  if (loading) {
    return <div>loading...</div>;
  }

  const category = data.categoryList;
  return (
    <>
      <Head>
        <title>{router.query.category.split("-").join(" ").toUpperCase()}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.grid}>
            {category[0].products.items && category[0].products.items.map((product, index) => 
              <ProductList category={router.query.category} product={product} />
            )}
          </div>
        </main>
      </div>
    </>
  )
}

export default withApollo({ ssr: true })(Index);