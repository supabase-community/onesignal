import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center justify-center min-h-screen">
        <button className="py-1 px-4 text-lg bg-blue-400">Order</button>
      </main>
    </>
  )
}

export default Home
