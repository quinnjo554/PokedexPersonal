import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllPokemon, getPokemonByName } from "../Pokefunctions/getFunctions";
import { pokemon } from "../interfaces";
import PresentPokemon from "./PresentPokemon";

function PokeFightingLanding() {
  const [pokemonArray, setPokemonArray] = useState<Array<pokemon>>([]);
  const [input, setInput] = useState("");
  const [page, setPage] = useState("0");
  const [pokemonData, setPokemonData] = useState<pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<string>("");

  const filteredSearch = input
    ? pokemonArray.filter((item) =>
        item.name.toLowerCase().includes(input.toLowerCase())
      )
    : [];

  const navigate = useNavigate(); // Access the history object

  async function handlePokemonClickFilter(name: string) {
    setInput(name);
    try {
      const pokemon = await getPokemonByName(name);
      setPokemonData((prev) => {
        const newPokemon = [...prev, pokemon];
        return newPokemon.slice(0, 2);
      });
      setSelectedPokemon(name); // Set the selected Pokémon's name
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

  useEffect(() => {
    if (pokemonData.length === 2) {
      navigate(`/battle/arena/${pokemonData[0].id}/${pokemonData[1].id}`);
    }
  }, [pokemonData, history]);

  return (
    <div className="text-black rounded-md flex flex-col items-center justify-center h-screen w-screen PickAPokemon">
      <button
        className="bg-sky-500 text-white fixed top-4 right-4 z-50 p-2"
        onClick={() => setPage((prev) => String(Number(prev) + 1))}
      >
        Next
      </button>
      <button
        className="bg-sky-500 left-4 text-white fixed top-4 z-50 p-2"
        onClick={() => setPage((prev) => String(Number(prev) - 1))}
      >
        Back
      </button>
      <PresentPokemon
        onPokemonClick={handlePokemonClickFilter}
        page={page}
        selectedPokemon={selectedPokemon}
      />
    </div>
  );
}

export default PokeFightingLanding;
