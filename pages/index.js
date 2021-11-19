import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useQuery, gql } from "@apollo/client";
import { withApollo } from "../lib/apollo";


import CategoryList from '../components/CategoryList'

const CATEGORY_LIST = gql`
  query Category {
    categoryList(filters: {}) {
      id
      name
      image
      url_key
    }
  }
`;

const Index = () => {

  const { loading, error, data } = useQuery(CATEGORY_LIST, {
    variables: {},
    // fetchPolicy: 'no-cache'
  });

  if (loading) {
    return <div>loading...</div>;
  }

  const category = data.categoryList;

  return (
    <div className={styles.container}>
      <Head>
        <title>Home Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.grid}>
          {category && category.map((ctg, index) => 
            <CategoryList ctg={ctg} />
          )}
        </div>
      </main>
    </div>
  )
}

export default withApollo({ ssr: true })(Index);