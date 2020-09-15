import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div id="home-page">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Link href="/board"><a>New Game</a></Link>
      <Link href="/join"><a>Join Game</a></Link>
    </div>
  )
}
