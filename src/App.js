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
  let n = 3;

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
        <Board
          xIsNext={xIsNext}
          n={n}
          squares={currentSquares}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay, n }) {
  const numberOfSquares = n;
  let winner = calculateWinner(squares, n);
  let WINNER_STATUS = false;
  if (winner === "X" || winner === "0") {
    WINNER_STATUS = `Winner is: ${winner}`;
  } else {
    WINNER_STATUS = `Next Player: ${xIsNext ? "X" : "0"}`;
  }
  const handleClick = (i) => {
    const nextSquares = squares.slice();
    if (nextSquares[i] || calculateWinner(squares, n)) {
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

const calculateWinner = (squares, n) => {
  const generateWinningCombinations = () => {
    let winningLines = [],
      diagonalRightToLeft = [],
      diagonalLeftToRight = [],
      leftToRight = [],
      topToBottom = [];
    for (let i = 0; i < n; i++) {
      diagonalLeftToRight.push(i * n + i);
      diagonalRightToLeft.push((i + 1) * n - (i + 1));
      leftToRight.push([]);
      topToBottom.push([]);
      for (let j = 0; j < n; j++) {
        leftToRight[i].push(i * n + j);
        topToBottom[i].push(j * n + i);
      }
    }
    winningLines = [
      ...leftToRight,
      ...topToBottom,
      diagonalLeftToRight,
      diagonalRightToLeft,
    ];
    return winningLines;
  };

  let userWinningLinesCombinations = generateWinningCombinations();

  for (let i = 0; i < userWinningLinesCombinations.length; i++) {
    const [a, b, c, ...rest] = userWinningLinesCombinations[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c] &&
      rest.every((index) => squares[a] === squares[index])
    ) {
      return squares[a];
    }
  }
  return null;
};
