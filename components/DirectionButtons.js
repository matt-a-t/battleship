import React from 'react';

function DirectionButtons({ direction, setDirection }) {
  return (
    <div id="direction-buttons">
      <div>
        <div className="centered-buttons">
          <button disabled={ direction === 'up'} onClick={() => setDirection('up')}>Up</button>
        </div>
        <div className="centered-buttons">
          <button disabled={ direction === 'left'} onClick={() => setDirection('left')}>Left</button>
          <button disabled={ direction === 'right'} onClick={() => setDirection('right')}>Right</button>
        </div>
        <div className="centered-buttons">
          <button disabled={ direction === 'down'} onClick={() => setDirection('down')}>Down</button>
        </div>
      </div>
    </div>
  );
}

export default DirectionButtons;