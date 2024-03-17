import { useState } from "react";

function Square({ value, onSquareClick, highlight }) {

  return <button className={highlight ? "square highlight" : "square"}
    onClick={onSquareClick}>
    {value}
  </button>;
}

function Board({ currentMove, squares, onPlay }) {
  const xIsNext = currentMove % 2 === 0;

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)[0]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay([nextSquares, i]);
  }

  const [winner, cells] = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (currentMove === 9) {
    status = "It's a draw.";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  let board = [];
  for (let row = 0; row < 3; row++) {
    let board_row = [];
    for (let col = 0; col < 3; col++) {
      let index = row * 3 + col;
      board_row.push(<Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} highlight={cells ? cells.includes(index) : false} />);
    }
    board.push(<div key={row} className="board-row">{board_row}</div>)
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([[Array(9).fill(null), null]]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove][0];
  const [orderAsd, setOrderAsd] = useState(true);

  function handleSort() {
    setOrderAsd(!orderAsd);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function restart() {
    setCurrentMove(0);
    setHistory([[Array(9).fill(null), null]]);
  }

  const moves = history.map(([squares, at], move) => {
    let description;
    if (move > 0) {
      let row = Math.floor(at / 3) + 1;
      let col = at % 3 + 1;
      let loc = "(" + row + ", " + col + ")";
      if (move === history.length - 1) {
        description = "You are at move " + loc;
        return (
          <li key={move}>
            <div>{description}</div>
          </li>
        );
      }
      description = 'Go to move ' + loc;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board currentMove={currentMove} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div className="control">
          <button onClick={() => handleSort()}>Sort by {orderAsd ? "asd" : "desc"}</button>
          <button onClick={() => restart()}>Restart</button>
        </div>
        <ol>{orderAsd ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i].slice()];
    }
  }
  return [null, null];
}
