const initialStatus = {
  gameId: '',
  player: 0,
  placement: {
    carrier: [],
    battleship: [],
    destroyer: [],
    submarine: [],
    patrolboat: [],
  },
  message: 'Please place your ships',
  phase: 'placement',
  error: false,
  placementDirection: 'right',
  currentlyPlacing: 'carrier',
}

export default initialStatus;