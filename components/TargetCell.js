function TargetCell({ cell, rowIndex, cellIndex, cellClick }) {
  return (
    <div className="sheet-cell" onClick={() => cellClick(rowIndex, cellIndex)}>
      { cell === 'hit' && <div className="ship-piece"><div className="marker hit" /></div> }
      { cell === 'miss' && <div className=" marker miss" /> }
    </div>
  )
}

export default TargetCell