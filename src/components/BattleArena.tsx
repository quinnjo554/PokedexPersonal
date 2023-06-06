import React, { useEffect, useState } from "react";
import { Move, MoveLearnset, Type, pokemon } from "../interfaces";
import { getMoveInfo, getPokemonById } from "../Pokefunctions/getFunctions";
import { allTypes } from "../constants";

function BattleArena(props: {
  player1: string | undefined;
  ai: string | undefined;
  player1Moves: MoveLearnset[];
  aiMoveSet: MoveLearnset[];
}) {
  const [player1Data, setPlayer1Data] = useState<pokemon>();
  const [aiData, setAIData] = useState<pokemon | undefined>();
  const [player1CurrentHP, setPlayer1CurrentHP] = useState<number>(0);
  const [aiCurrentHP, setAICurrentHP] = useState<number>(0);
  const [isPlayer1Turn, setIsPlayer1Turn] = useState(false);
  const [isPlayer1Defeated, setIsPlayer1Defeated] = useState(false);
  const [isAIDefeated, setIsAIDefeated] = useState(false);

  //set level of pokemon with a slider

  function calculateDamage(
    attacker: pokemon | undefined,
    defender: pokemon | undefined,
    move: Move
  ) {
    // Check if attacker and defender are defined before performing calculations
    if (!attacker || !defender) {
      return 0;
    }
    //
    // Calculate the damage formula
    const level = 15;
    const attack = attacker.attack;
    const defense = defender.defense;
    const basePower = move.basePower;
    const typeEffectiveness = getTypeEffectiveness(move.type, defender.types); // Calculate the type effectiveness of the move
    const modifier = calculateModifier(); // Calculate additional modifiers

    const damage = Math.floor(
      ((((2 * level) / 5 + 2) * basePower * (attack / defense)) / 50) *
        modifier *
        typeEffectiveness
    );

    return damage;
  }

  async function handlePokemonMove(name: string) {
    //check whos turn it is then take damageaccordingly also if there hp is zero
    if (isPlayer1Turn) {
      const move = await getMoveInfo(name);
      setAICurrentHP((prev) => {
        const damage = calculateDamage(player1Data, aiData, move);
        if (prev - damage <= 0) {
          setIsAIDefeated(true);
          return 0;
        }
        return (prev -= damage);
      });
      setIsPlayer1Turn((prev) => {
        return !prev;
      });
    } else {
      const randomNumber: number = Math.floor(Math.random() * 4);
      const move = await getMoveInfo(props.aiMoveSet[randomNumber].move.name);
      setPlayer1CurrentHP((prev) => {
        const damage = calculateDamage(aiData, player1Data, move);
        if (prev - damage <= 0) {
          setIsPlayer1Defeated(true);
          return 0;
        }
        return (prev -= damage);
      });
      setIsPlayer1Turn((prev) => {
        return !prev;
      });
      if (player1CurrentHP <= 0) {
      }
    }
  }

  function getTypeEffectiveness(
    moveType: string,
    defenderTypes: Type[]
  ): number {
    const typeChart: Record<string, Record<string, number>> = allTypes;

    let effectiveness = 1;
    for (const type of defenderTypes) {
      effectiveness *= typeChart[moveType][type.name];
    }

    return effectiveness;
  }

  function calculateModifier(): number {
    // You can implement the specific modifiers based on the game mechanics you want to simulate
    // Here's a simple example with a random factor between 0.85 and 1.0
    const randomFactor = Math.random() * (1.0 - 0.85) + 0.85;

    return randomFactor;
  }

  useEffect(() => {
    async function getPokemon() {
      const player1Pokemon = await getPokemonById(props.player1);
      setPlayer1Data(player1Pokemon);
      setPlayer1CurrentHP(player1Pokemon?.hp);
      const first =
        aiData && player1Data && aiData.speed && player1Data.speed
          ? aiData.speed > player1Data.speed
          : true;
      setIsPlayer1Turn(first);
    }
    getPokemon();
  }, [props.player1]);

  useEffect(() => {
    async function getAIPokemon() {
      const aiPokemon = await getPokemonById(props.ai);
      setAIData(aiPokemon);
      setAICurrentHP(aiPokemon?.hp);
    }
    getAIPokemon();
  }, [props.ai]);

  return (
    <div className="fixed top-0 right-0 w-full h-full arena bg-gray-900">
      <div>
        <img
          className={`w-1/3 left-[9%] bottom-[-11rem] fixed ${
            isPlayer1Defeated ? "fadeOut" : ""
          }`}
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${props.player1}.png`}
          alt=""
        />
      </div>
      <div
        className={`player1 bg-white text-black p-4 rounded-lg absolute bottom-6 right-[20%] ${
          isPlayer1Defeated ? "fadeOut" : ""
        }`}
      >
        <h1 className="text-2xl font-bold mb-2">{player1Data?.name}</h1>
        <div className="health-bar bg-red-400 h-4 mb-2">
          <div
            className="bg-green-400 h-full"
            style={{
              width: `${(player1CurrentHP / (player1Data?.hp || 1)) * 100}%`,
            }}
          ></div>
        </div>
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm">
            {player1CurrentHP} / {player1Data?.hp}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {isPlayer1Turn ? (
            props.player1Moves.map((value, index) => (
              <div
                key={index}
                className="bg-gray-200 text-black px-2 py-1 rounded-md text-sm"
              >
                <button
                  disabled={isPlayer1Defeated || isAIDefeated}
                  onClick={() => handlePokemonMove(value.move.name)}
                >
                  {value.move.name}
                </button>
              </div>
              //handlePokemonMove(props.aiMoveSet[0].move.name) this doesnt need a move because it will take a random one anyway
            ))
          ) : (
            <button
              className="bg-gray-200 px-2 py-1 rounded-md text-sm"
              onClick={() => {
                handlePokemonMove(props.aiMoveSet[0].move.name);
              }}
            >
              {aiData?.name}'s Turn
            </button>
          )}
        </div>
      </div>
      <div>
        <img
          className={`w-[29%] right-[12%] top-[8%] fixed ${
            isAIDefeated ? "fadeOut" : ""
          }`}
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.ai}.png`}
          alt=""
        />
      </div>
      <div
        className={`ai bg-white text-black p-4 rounded-lg absolute top-6 left-[20%] ${
          isAIDefeated ? "fadeOut" : ""
        }`}
      >
        <h1 className="text-2xl font-bold mb-2">{aiData?.name}</h1>
        <div className="health-bar bg-red-400 h-4 mb-2 ">
          <div
            className="bg-green-400 h-full"
            style={{
              width: `${(aiCurrentHP / (aiData?.hp || 1)) * 100}%`,
            }}
          ></div>
        </div>
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm">
            {aiCurrentHP} / {aiData?.hp}
          </div>
        </div>
      </div>
      {isPlayer1Defeated && (
        <div className="pokemon-won-screen">
          <h2 className="text-4xl text-white">{aiData?.name} Won!</h2>
          {/* Add additional content or styling for the won screen */}
        </div>
      )}

      {isAIDefeated && (
        <div className="pokemon-won-screen">
          <h2 className=" text-4xl text-white">{player1Data?.name} Won!</h2>
          {/* Add additional content or styling for the won screen */}
        </div>
      )}
    </div>
  );
}

export default BattleArena;
