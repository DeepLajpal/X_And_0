import { useState } from "react";

const Square = ({ value, onSquareClick }) => {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
};

export default function Game() {
  const [moveHistory, setMoveHistory] = useState([Array(9).fill(null)]);
  const [activeMove, setActiveMove] = useState(0);
  const currentSquares = moveHistory[activeMove];
  const [boardSize, setBoardSize] = useState(3);
  const [boardSizeInput, setBoardSizeInput] = useState(boardSize);
  const isXTurn = activeMove % 2 === 0;
  const [sortAscending, setSortAscending] = useState(true);

  const handleMove = (nextSquares) => {
    const newHistory = [...moveHistory.slice(0, activeMove + 1), nextSquares];
    setMoveHistory(newHistory);
    setActiveMove(newHistory.length - 1);
  };

  const goToMove = (step) => {
    if (step === 0) {
      setMoveHistory([Array(9).fill(null)]);
    }
    setActiveMove(step);
  };

  const moveList = moveHistory.map((squares, move) => {
    let description;
    const calculatedStep = sortAscending ? move : moveHistory.length - 1 - move;
    description = `Go to move #${calculatedStep}`;
    return (
      <>
        {calculatedStep <= 0 ? null : (
          <li key={calculatedStep}>
            <button onClick={() => goToMove(calculatedStep)}>
              {calculatedStep === moveHistory.length - 1 && calculatedStep !== 0
                ? `You are at move #${calculatedStep}`
                : description}
            </button>
          </li>
        )}
      </>
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

  const winner = determineWinner(squares, boardSize);

  let gameStatus = "";
  if (winner === "X" || winner === "O") {
    gameStatus = `Winner is: ${winner}`;
  } else {
    gameStatus = `Next Player: ${isXTurn ? "X" : "O"}`;
  }

  const handleSquareClick = (index) => {
    const nextSquares = squares.slice();
    if (nextSquares[index] || determineWinner(squares, boardSize)) {
      return;
    }
    nextSquares[index] = isXTurn ? "X" : "O";
    onMove(nextSquares);
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
                        onSquareClick={() => handleSquareClick(squareIndex)}
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
    const [first, second, third, ...rest] = winningLines[i];
    if (
      squares[first] &&
      squares[first] === squares[second] &&
      squares[first] === squares[third] &&
      rest.every((index) => squares[first] === squares[index])
    ) {
      return squares[first];
    }
  }
  return null;
};
