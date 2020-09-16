import { useRouter } from 'next/router'

function Join() {
  
  const [gameid, setGameid] = React.useState('');
  
  const router = useRouter();
  
  // todo: check valid gameid
  function joinGame() {
    router.push(`/game/2/${gameid}`)
  }
  
  return (
    <div id="join">
      <label>
        Please input the game id you would like to join
        <input type="text" value={gameid} onChange={e => setGameid(e.target.value)} />
      </label>

      <button className="big" onClick={() => joinGame()}>Join</button>
    </div>
  )
}

export default Join