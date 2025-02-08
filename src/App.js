import { useState } from "react";

const Square = ({ value, onSquareClick, highlight }) => {
  return (
    <button
      className={`square ${highlight ? "highlight" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
};

export default function Game() {
  const [boardSize, setBoardSize] = useState(3);
  const [moveHistory, setMoveHistory] = useState([
    Array(boardSize ** 2).fill(null),
  ]);
  const [moveHistoryLocations, setMoveHistoryLocations] = useState([
    Array(boardSize ** 2).fill(null),
  ]);
  const [activeMove, setActiveMove] = useState(0);
  const currentSquares = moveHistory[activeMove];
  const [boardSizeInput, setBoardSizeInput] = useState(boardSize);
  const isXTurn = activeMove % 2 === 0;
  const [sortAscending, setSortAscending] = useState(true);

  const handleMove = (nextSquares, rowIndex, colIndex) => {
    const newHistory = [...moveHistory.slice(0, activeMove + 1), nextSquares];
    setMoveHistory(newHistory);
    setMoveHistoryLocations((prev) => [...prev, [rowIndex, colIndex]]);
    setActiveMove(newHistory.length - 1);
  };

  const goToMove = (step) => {
    if (step === 0) {
      setMoveHistory([Array(9).fill(null)]);
    }
    setActiveMove(step);
  };

  const moveList = moveHistory.map((squares, move) => {
    const calculatedStep = sortAscending ? move : moveHistory.length - 1 - move;
    const row = moveHistoryLocations[calculatedStep][0] + 1;
    const column = moveHistoryLocations[calculatedStep][1] + 1;
    if (calculatedStep <= 0) return null;
    return (
      <li key={calculatedStep}>
        <button onClick={() => goToMove(calculatedStep)}>
          {calculatedStep === moveHistory.length - 1 && calculatedStep !== 0
            ? `You are at move #${calculatedStep} => row: ${row} column: ${column}`
            : `Go to move #${calculatedStep} => row: ${row} column: ${column}`}
        </button>
      </li>
    );
  });

  const handleKeyDown = (e) => {
    if (Number(e.target.value) < 0) {
      return;
    }
    if (e.key === "Enter") {
      console.log("User Pressed Enter");
      setBoardSize(Number(e.target.value));
    }
  };

  const handleBoardSizeUpdate = (inputValue) => {
    if (inputValue < 0) {
      return;
    }
    console.log("User Clicked Update Btn");
    setBoardSize(inputValue);
  };

  const handleInputChange = (e) => {
    if (Number(e.target.value) < 0) {
      return;
    }
    setBoardSizeInput(Number(e.target.value));
    setBoardSize(Number(e.target.value));
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board
          isXTurn={isXTurn}
          boardSize={boardSize}
          squares={currentSquares}
          onMove={handleMove}
        />
      </div>
      <div className="game-info">
        <button onClick={() => setSortAscending(!sortAscending)}>
          <label>Sort moves in ascending order</label>
          <input
            type="checkbox"
            checked={sortAscending}
            onChange={() => setSortAscending(!sortAscending)}
          />
        </button>
        <ol>
          <button onClick={() => goToMove(0)}>Go to start</button>
        </ol>
        <ol>{moveList}</ol>
      </div>
      <div className="game-info">
        <label>Update board size</label>
        <input
          type="number"
          value={boardSizeInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          onClick={() => handleBoardSizeUpdate(boardSizeInput)}
        >
          Update
        </button>
      </div>
    </div>
  );
}

function Board({ isXTurn, squares, onMove, boardSize }) {
  const currentBoardSize = boardSize;

  const result = determineWinner(squares, boardSize);
  let gameStatus = "";
  if (result && result.winner) {
    gameStatus = `Winner is: ${result.winner}`;
  } else {
    gameStatus = `Next Player: ${isXTurn ? "X" : "O"}`;
  }

  const handleSquareClick = (index, rowIndex, colIndex) => {
    const nextSquares = squares.slice();
    if (nextSquares[index] || (result && result.winner)) {
      return;
    }
    nextSquares[index] = isXTurn ? "X" : "O";
    onMove(nextSquares, rowIndex, colIndex);
  };

  return (
    <>
      <div className="status">{gameStatus ? gameStatus : null}</div>
      {currentBoardSize > 0 &&
        Array(currentBoardSize)
          .fill(null)
          .map((_, rowIndex) => {
            return (
              <div key={rowIndex} className="board-row">
                {Array(currentBoardSize)
                  .fill(null)
                  .map((_, colIndex) => {
                    const squareIndex = rowIndex * currentBoardSize + colIndex;
                    return (
                      <Square
                        key={squareIndex}
                        value={squares[squareIndex]}
                        onSquareClick={() =>
                          handleSquareClick(squareIndex, rowIndex, colIndex)
                        }
                        highlight={
                          result && result.winningLine.includes(squareIndex)
                        }
                      ></Square>
                    );
                  })}
              </div>
            );
          })}
    </>
  );
}

const determineWinner = (squares, boardSize) => {
  const generateWinningLines = () => {
    let winningLines = [],
      mainDiagonal = [],
      antiDiagonal = [],
      rows = [],
      columns = [];
    for (let i = 0; i < boardSize; i++) {
      mainDiagonal.push(i * boardSize + i);
      antiDiagonal.push((i + 1) * boardSize - (i + 1));
      rows.push([]);
      columns.push([]);
      for (let j = 0; j < boardSize; j++) {
        rows[i].push(i * boardSize + j);
        columns[i].push(j * boardSize + i);
      }
    }
    winningLines = [...rows, ...columns, mainDiagonal, antiDiagonal];
    return winningLines;
  };

  const winningLines = generateWinningLines();
  console.log(winningLines);

  for (let i = 0; i < winningLines.length; i++) {
    const line = winningLines[i];
    const first = line[0];
    if (
      squares[first] &&
      line.every((index) => squares[index] === squares[first])
    ) {
      return { winner: squares[first], winningLine: line };
    }
  }
  return null;
};
