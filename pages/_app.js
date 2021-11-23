import '../styles/globals.css'
import Layout from '../components/layout'
import { AppProvider } from '../context/AppContext'

export default function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppProvider>
  )
}