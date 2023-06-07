import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPokemon, getPokemonByName } from "../Pokefunctions/getFunctions";
import { pokemon } from "../interfaces";

function PokeFightingLanding() {
  const [pokemonArray, setPokemonArray] = useState<Array<pokemon>>([]);
  //const [pokemonMoveSet, setPokemonMoveSet] = useState<Array<MoveLearnset>>();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [pokemonData, setPokemonData] = useState<pokemon[]>([]);
  const [pokeImg, setPokeImg] = useState<Array<string>>([]);
  // Filter for name
  const filteredSearch = input
    ? pokemonArray.filter((item) =>
        item.name.toLowerCase().includes(input.toLowerCase())
      )
    : [];

  async function handlePokemonClick(name: string) {
    if (inputRef.current) {
      inputRef.current.value = name;
    }
    setInput(name);
    try {
      const pokemon = await getPokemonByName(name);
      setPokemonData((prev) => {
        const newPokemon = [...prev, pokemon];
        return newPokemon.slice(0, 2);
      });
      //setPokemonMoveSet(moves);
      setPokeImg((prevImages) => {
        const newImages = [
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
          ...prevImages,
        ];
        return newImages.slice(0, 2); // Keep a maximum of two images
      });
      console.log(pokemonData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function initPokeArray() {
      const MAX_POKEMON = 550;
      const allData = await getAllPokemon("0", MAX_POKEMON);
      setPokemonArray(allData["content"]);
    }
    initPokeArray();
  }, []);

  return (
    <div className="text-black rounded-md flex flex-col items-center justify-center h-screen w-screen PickAPokemon">
      <div className="flex mr-5">
        {pokeImg.map((value, index) => (
          <img
            className="mr-32"
            width="200px"
            key={index}
            src={value}
            alt={value}
          />
        ))}
      </div>

      <div className="w-1/2">
        <input
          ref={inputRef}
          className="w-full border-2 rounded-lg p-2"
          type="text"
          placeholder="Search Pokemon"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="h-64 text-white bg-slate-300 bg-opacity-70 rounded-lg overflow-y-scroll flex flex-col items-center justify-center">
          {filteredSearch.map((pokemonItem) => (
            <div
              className="text-center mt-2 bg-white text-black rounded-md w-2/3 p-2 cursor-pointer"
              key={pokemonItem.id}
              onClick={() => handlePokemonClick(pokemonItem.name)}
            >
              {pokemonItem.name}
            </div>
          ))}
        </div>
      </div>
      {pokeImg.length === 2 ? (
        <Link
          to={`/battle/arena/${pokemonData[0].id}/${pokemonData[1].id}`}
          className="text-white bg-blue-500 px-4 py-2 rounded-lg mt-4"
        >
          Next
        </Link>
      ) : null}
    </div>
  );
}

export default PokeFightingLanding;
