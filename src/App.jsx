import React, { useState, useEffect } from 'react';
import './App.css';

const initialBoard = Array(9).fill(null);

const App = () => {
  const [board, setBoard] = useState(initialBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [moves, setMoves] = useState([]);
  const [isComputer, setIsComputer] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const handleClick = (index) => {
    if (board[index] || calculateWinner(board) || (isComputer && !isXNext)) return;

    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    setMoves([...moves, index]);
  };

  const startAgain = () => {
    setBoard(initialBoard);
    setIsXNext(true);
    setMoves([]);
    setGameStarted(false);
  };

  useEffect(() => {
    if (isComputer && !isXNext && !calculateWinner(board)) {
      const timer = setTimeout(() => {
        botMove();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isXNext, board, isComputer]);

  useEffect(() => {
    if (moves.length > 7) {
      const indexToClear = moves[0];
      setBoard(board.map((val, idx) => (idx === indexToClear ? null : val)));
      setMoves(moves.slice(1));
    }
  }, [moves, board]);

  useEffect(() => {
    if (moves.length > 0) {
      const timer = setTimeout(() => {
        const indexToClear = moves[0];
        setBoard(board.map((val, idx) => (idx === indexToClear ? null : val)));
        setMoves(moves.slice(1));
      }, 5000); // 5000 ms (5 seconds)
      return () => clearTimeout(timer);
    }
  }, [moves, board]);

  const botMove = () => {
    const availableMoves = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);

    if (availableMoves.length === 0) return;

    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    const newBoard = board.slice();
    newBoard[randomMove] = 'O';
    setBoard(newBoard);
    setIsXNext(true);
    setMoves([...moves, randomMove]);
  };

  const winner = calculateWinner(board);
  let status;
  if (winner) {
    alert("Winner is " + winner);
    startAgain();
  } else {
    status = 'Turn: ' + (isXNext ? 'X' : 'O');
  }

  const startGame = (mode) => {
    setIsComputer(mode === 'computer');
    setGameStarted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 font-comicsans">
      <h1 className="text-5xl font-bold text-white mb-8">Infinity TicTacToe</h1>
      {!gameStarted ? (
        <div className="flex flex-col items-center">
          <button
            className="mb-4 w-48 h-16 text-2xl font-bold bg-white rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-200 border-4 border-black"
            onClick={() => startGame('computer')}
          >
            Play Against Computer
          </button>
          <button
            className="w-48 h-16 text-2xl font-bold bg-white rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-200 border-4 border-black"
            onClick={() => startGame('player')}
          >
            Play Against Player
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            {board.map((value, index) => (
              <button
                key={index}
                className="w-24 h-24 text-4xl font-bold flex items-center justify-center bg-white rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-200 border-4 border-black"
                onClick={() => handleClick(index)}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="mt-8 text-2xl text-white">{status}</div>
          <button
            className="mt-4 w-48 h-16 text-2xl font-bold bg-white rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-200 border-4 border-black"
            onClick={startAgain}
          >
            Start Again
          </button>
        </>
      )}
    </div>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export default App;
