import '../styles/globals.css'
import '../styles/App.scss'

function MyApp({ Component, pageProps }) {
  return (
    <div id="App">
      <div id="header">
        <h1>Battleship</h1>
      </div>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
