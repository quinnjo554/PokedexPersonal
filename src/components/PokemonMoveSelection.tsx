import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLearnset } from "../Pokefunctions/getFunctions";
import { MoveLearnset } from "../interfaces";
import { Link } from "react-router-dom";
import BattleArena from "./BattleArena";
function PokemonMoveSelection() {
  const [player1Moves, setPlayer1Moves] = useState<Array<MoveLearnset>>([]);
  const [aiMoves, setAiMoves] = useState<Array<MoveLearnset>>([]);
  const [selectedPlayer1Moves, setSelectedPlayer1Moves] = useState<
    Array<MoveLearnset>
  >([]);
  const [selectedAiMoves, setSelectedAiMoves] = useState<Array<MoveLearnset>>(
    []
  );
  const { player1, ai } = useParams();

  useEffect(() => {
    async function getPlayer1Moves() {
      const moves = await getLearnset(Number(player1));
      setPlayer1Moves(moves || []);
    }

    async function getAiMoves() {
      const moves = await getLearnset(Number(ai));
      setAiMoves(moves || []);
    }

    getPlayer1Moves();
    getAiMoves();
  }, [player1, ai]);

  const handlePlayer1MoveClick = (move: MoveLearnset) => {
    if (selectedPlayer1Moves.length < 4) {
      setSelectedPlayer1Moves((prevMoves) => [...prevMoves, move]);
    }
  };

  const handleAiMoveClick = (move: MoveLearnset) => {
    if (selectedAiMoves.length < 4) {
      setSelectedAiMoves((prevMoves) => [...prevMoves, move]);
    }
  };

  return (
    <div className="text-center">
      <div className="flex overflow-x-scroll">
        <div className="flex-shrink-0 w-1/2">
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${player1}.png`}
            alt=""
            className="w-40 mx-auto mb-4 "
          />
          <h2 className="text-xl mb-2">Player 1 Moves:</h2>
          <ul className="list-disc mx-auto w-full h-40 overflow-y-auto">
            {player1Moves.map((move, index) => (
              <li
                key={index}
                onClick={() => handlePlayer1MoveClick(move)}
                className={`cursor-pointer px-2 py-1 rounded-md ${
                  selectedPlayer1Moves.find(
                    (selectedMove) => selectedMove.move.name === move.move.name
                  )
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
              >
                {move.move.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-shrink-0 w-1/2">
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${ai}.png`}
            alt=""
            className="w-40 mx-auto mb-4"
          />
          <h2 className="text-xl mb-2">AI Moves:</h2>
          <ul className="list-disc mx-auto w-full h-40 overflow-y-auto">
            {aiMoves.map((move, index) => (
              <li
                key={index}
                onClick={() => handleAiMoveClick(move)}
                className={`cursor-pointer px-2 py-1 rounded-md ${
                  selectedAiMoves.find(
                    (selectedMove) => selectedMove.move.name === move.move.name
                  )
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
              >
                {move.move.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h2 className="text-xl mt-4">Selected Moves:</h2>
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg">Player 1:</h3>
            <ul>
              {selectedPlayer1Moves.map((move, index) => (
                <li key={index}>{move.move.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg">AI:</h3>
            <ul>
              {selectedAiMoves.map((move, index) => (
                <li key={index}>{move.move.name}</li>
              ))}
            </ul>
          </div>
        </div>
        {selectedAiMoves.length == 4 && selectedPlayer1Moves.length == 4 ? (
          <BattleArena
            player1={player1}
            ai={ai}
            player1Moves={selectedPlayer1Moves}
            aiMoveSet={selectedAiMoves}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default PokemonMoveSelection;
