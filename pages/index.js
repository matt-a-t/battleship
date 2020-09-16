import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Axios from 'axios'


export default function Home() {
  const router = useRouter();
  function startGame() {
    Axios.post('/api/start-game').then(resp => {
      router.push(`/game/1/${resp.data.newGameId}`)
    })
  }

  return (
    <div id="home-page">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <a onClick={() => startGame()}>New Game</a>
      <Link href="/join"><a>Join Game</a></Link>
    </div>
  )
}
