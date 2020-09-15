import React from 'react';

function ShipButtons({ currentlyPlacing, setCurrentlyPlacing }) {
  return (
    <div className="centered-buttons">
      <button disabled={currentlyPlacing === 'carrier'} onClick={() => setCurrentlyPlacing('carrier')}>Carrier</button>
      <button disabled={currentlyPlacing === 'battleship'} onClick={() => setCurrentlyPlacing('battleship')}>Battleship</button>
      <button disabled={currentlyPlacing === 'destroyer'} onClick={() => setCurrentlyPlacing('destroyer')}>Destroyer</button>
      <button disabled={currentlyPlacing === 'submarine'} onClick={() => setCurrentlyPlacing('submarine')}>Submarine</button>
      <button disabled={currentlyPlacing === 'patrolboat'} onClick={() => setCurrentlyPlacing('patrolboat')}>Patrol Boat</button>
    </div>
  );
}

export default ShipButtons;