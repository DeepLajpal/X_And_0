import { useState } from "react";
const Square = ({ value, onSquareClick }) => {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
};

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  const handlePlay = (nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const jumpTo = (nextMove) => {
    if (nextMove === 0) {
      setHistory([Array(9).fill(null)]);
    }
    setCurrentMove(nextMove);
  };
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `Go to move #${move}`;
    } else {
      description = `Go to start`;
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>
          {move === history.length - 1 && move !== 0
            ? `You are at move #${move}`
            : description}
        </button>
      </li>
    );
  });
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const numberOfSquares = 5;
  let winner = calculateWinner(squares);
  let WINNER_STATUS = false;
  if (winner === "X" || winner === "0") {
    WINNER_STATUS = `Winner is: ${winner}`;
  } else {
    WINNER_STATUS = `Next Player: ${xIsNext ? "X" : "0"}`;
  }
  const handleClick = (i) => {
    const nextSquares = squares.slice();
    if (nextSquares[i] || calculateWinner(squares)) {
      return;
    }
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "0";
    }
    onPlay(nextSquares);
  };

  return (
    <>
      <div className="status">{WINNER_STATUS ? WINNER_STATUS : null}</div>
      {Array(numberOfSquares)
        .fill(null)
        .map((_, rowIndex) => {
          return (
            <div key={rowIndex} className="board-row">
              {Array(numberOfSquares)
                .fill(null)
                .map((_, colIndex) => {
                  const index = rowIndex * numberOfSquares + colIndex;
                  return (
                    <Square
                      key={index}
                      value={squares[index]}
                      onSquareClick={() => handleClick(index)}
                    ></Square>
                  );
                })}
            </div>
          );
        })}
    </>
  );
}

const calculateWinner = (squares) => {
  const userWinningLinesCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < userWinningLinesCombinations.length; i++) {
    const [a, b, c] = userWinningLinesCombinations[i];
    if (
      squares &&
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
};
