// src/components/Game.js
import React, { useState, useEffect } from 'react';
import { databases, realtime, ID } from '../appwriteConfig';

const Game = ({ userId }) => {
    const [gameId, setGameId] = useState('');
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        if (gameId) {
            const unsubscribe = realtime.subscribe(`databases.YOUR_DATABASE_ID.collections.YOUR_COLLECTION_ID.documents.${gameId}`, response => {
                setBoard(response.payload.board);
                setIsXNext(response.payload.isXNext);
                setWinner(response.payload.winner);
            });
            return () => unsubscribe();
        }
    }, [gameId]);

    const createGame = async () => {
        const response = await databases.createDocument('YOUR_DATABASE_ID', 'YOUR_COLLECTION_ID', ID.unique(), {
            board: Array(9).fill(null),
            isXNext: true,
            winner: null,
        });
        setGameId(response.$id);
    };

    const joinGame = (id) => {
        setGameId(id);
    };

    const handleClick = async (index) => {
        if (winner || board[index]) return;
        const newBoard = board.slice();
        newBoard[index] = isXNext ? 'X' : 'O';
        const newIsXNext = !isXNext;
        const newWinner = calculateWinner(newBoard);

        await databases.updateDocument('YOUR_DATABASE_ID', 'YOUR_COLLECTION_ID', gameId, {
            board: newBoard,
            isXNext: newIsXNext,
            winner: newWinner,
        });
    };

    const calculateWinner = (board) => {
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
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    };

    return (
        <div>
            <div>
                <button onClick={createGame}>Create Game</button>
                <input
                    type="text"
                    placeholder="Game ID"
                    onChange={(e) => joinGame(e.target.value)}
                />
            </div>
            <div className="board">
                {board.map((cell, index) => (
                    <button key={index} onClick={() => handleClick(index)}>
                        {cell}
                    </button>
                ))}
            </div>
            {winner && <div>{`Winner: ${winner}`}</div>}
        </div>
    );
};

export default Game;
