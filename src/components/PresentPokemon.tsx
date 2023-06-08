import React, { useEffect, useState } from "react";
import { getAllPokemon } from "../Pokefunctions/getFunctions";
import { PresentPokemonProps, pokemon } from "../interfaces";
import { Link } from "react-router-dom";
//FOR PRACTICE
//MAKE COMPONENTS MORE MODULER

function PresentPokemon(props: PresentPokemonProps) {
  const [pokemonArray, setPokemonArray] = useState<pokemon[]>();
  const MAX_POKEMON = 30;
  useEffect(() => {
    async function getData() {
      const data = await getAllPokemon(props.page, MAX_POKEMON);
      const pokeArray: pokemon[] = data["content"];
      setPokemonArray(pokeArray);
    }
    getData();
  }, [props.page]);
  return (
    <div>
      <ul className="p-24 ml-8 grid grid-cols-1 gap-2 gap-x-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {pokemonArray?.map((value, index) => {
          const isSelected = props.selectedPokemon === value.name; // Check if the Pokémon is selected
          const pokemonCardClassName = `pokemon-card w-48 p-2 grid rounded-md mt-3 bg-black transition-all ease-in-out bg-opacity-70 text-white ${
            isSelected ? "bg-blue-400" : "" // Apply "bg-blue" class if selected
          }`;
          return (
            <div
              key={index}
              onClick={() => props.onPokemonClick(value.name)}
              className={`${pokemonCardClassName}`}
            >
              <li className="text-center bg-slate-500 rounded-md">
                {value["name"]}
              </li>
              <img
                className="mx-auto"
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${value.id}.png`}
                alt=""
                width="90"
                height="110"
              />
              <div className="flex justify-between">
                <p>#{value["id"]}</p>
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export default PresentPokemon;
