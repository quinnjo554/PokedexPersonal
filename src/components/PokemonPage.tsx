import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAbilityDef,
  getPokeIdByName,
  getPokemonById,
  getPokemonEvolution,
} from "../Pokefunctions/getFunctions";
import { evolutionChain, pokemon, typeColors } from "../interfaces";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useRef } from "react";
import { startStarfieldAnimation } from "../starfield";
import { Link } from "react-router-dom";
import backArrow from "../assets/icons8-back-arrow-100.png";
import Tilt from "react-parallax-tilt";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function PokemonPage() {
  const { id } = useParams();
  const [pokeData, setPokeData] = useState<pokemon>();
  const [spriteRender, setSprteRender] = useState(``);
  const [evolutionChain, setEvolutionChain] = useState<evolutionChain[]>();
  //used to get id and link to pokemon evolutions
  const [basePokemon, setBasePokemon] = useState("");
  const [pokeFamilyIds, setPokeFamilyIds] = useState<number>(0);
  const [background, setBackground] = useState<Array<string>>([]);
  const [updatePage, setUpdatePage] = useState(false);
  const [abilityDef, SetAbilityDef] = useState<Array<string>>([]);
  const [showAbillityDef, setShowAbilityDef] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Stats",
        font: {
          size: 20,
        },
        color: "white",
      },
      legend: {
        display: false,
      },
      tooltip: {},
    },
    scales: {
      x: {
        display: true,
        ticks: {
          color: "white",
        },
      },
      y: {
        display: false,
      },
    },
  };

  const data = {
    labels: [
      "HP",
      "Attack",
      "Defense",
      "Special Attack",
      "Special Defense",
      "Speed",
    ],
    datasets: [
      {
        label: pokeData?.name,
        data: pokeData
          ? [
              pokeData.hp,
              pokeData.attack,
              pokeData.defense,
              pokeData.specialAttack,
              pokeData.specialDefense,
              pokeData.speed,
            ]
          : [],
        backgroundColor: "rgba(255, 255, 255,0.9)",
      },
    ],
  };

  function getNextPageNumber(
    currentPageNum: number,
    increment: number,
    minPageNum: number,
    maxPageNum: number
  ) {
    const nextPageNum = currentPageNum + increment;
    if (nextPageNum > maxPageNum - 1) {
      return maxPageNum - 1;
    } else if (nextPageNum < minPageNum) {
      return minPageNum;
    } else {
      return nextPageNum;
    }
  }

  //starfeild use effect
  useEffect(() => {
    startStarfieldAnimation(canvasRef);
    getPokeIdByName(basePokemon).then((data) => {
      setPokeFamilyIds(data["id"]);
    });
  }, [data]);
  /**
   * gets a list of pokemon and there evolution chain
   * sets base pokemon(lowest possible evolution) and sets the background color
   */
  useEffect(() => {
    async function getPokeData() {
      const pokemonData = await getPokemonById(id);
      setPokeData(pokemonData);
      const evolutionData = await getPokemonEvolution(pokemonData.name);
      setEvolutionChain(evolutionData["chain"]["evolves_to"]);
      setBasePokemon(evolutionData["chain"]["species"]["name"]);
      const color = typeColors[pokemonData.types[0].name] || "bg-gray-200";
      const color2 =
        typeColors[pokemonData.types[1]?.name] ||
        typeColors[pokemonData.types[0].name];
      let array: string[] = [color, color2];
      setBackground(array);
      setSprteRender(
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
      );
      // const abilities = pokeData?.abilities.map((ability) => ability.name);
      // const abilityDefs = await getAbilityDef(pokeData?.abilities);
      // SetAbilityDef(abilityDefs);
    }
    getPokeData();
  }, [updatePage]);

  if (!pokeData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <canvas ref={canvasRef} className="starfield-canvas-pokemon bg-black" />
      <div className="max-w-3xl mx-auto mt-12 text-white">
        <Link to={`http://localhost:5173/pokemon/0`}>
          <h1 className=" bg-white text-black text-xl font-bold text-center mb-2  p-2 py-2 transition-all ease-in-out rounded-md hover:bg-blue-500">
            {"Pokedex"}
          </h1>
        </Link>
        <Link
          onClick={() => setUpdatePage((prev) => !prev)}
          to={`http://localhost:5173/pokemonPage/${getNextPageNumber(
            Number(pokeData.id),
            -1,
            1,
            550
          )}`}
        >
          <img
            src={backArrow}
            alt="Back"
            className="w-16 bg-white rounded-full absolute left-6"
          />
        </Link>
        <Link
          onClick={() => setUpdatePage((prev) => !prev)}
          to={`http://localhost:5173/pokemonPage/${getNextPageNumber(
            Number(pokeData.id),
            1,
            1,
            550
          )}`}
        >
          <img
            src={backArrow}
            alt="Next"
            className="w-16 bg-white rounded-full rotate-180 right-6 absolute"
          />
        </Link>

        <h1 className="text-4xl font-bold text-center mb-16">
          {pokeData.name} #{pokeData.id}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            <div className="cardSurface w-max">
              <Tilt tiltReverse={true}>
                <img
                  className="rounded-md raiseImg bg-slate-200 bg-opacity-60"
                  src={spriteRender}
                  width="300"
                  height="300"
                  alt={pokeData.name}
                />
              </Tilt>
            </div>

            <div className="absolute top-[-14.5%] left-[-1%] m-2">
              <button
                className="bg-slate-200 font-semibold bg-opacity-60 hover:bg-opacity-80 text-white text-lg px-4 py-1 rounded-md  transition duration-300 ease-in-out"
                onClick={() => {
                  setSprteRender(
                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
                  );
                }}
              >
                Original
              </button>
              <button
                className="bg-slate-200 font-semibold bg-opacity-60 hover:bg-opacity-80 text-white text-lg px-4 py-1 rounded-md  transition duration-300 ease-in-out"
                onClick={() => {
                  setSprteRender(
                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeData.id}.png`
                  );
                }}
              >
                Sprite
              </button>
              <button
                className="bg-slate-200 font-semibold bg-opacity-60 hover:bg-opacity-80 text-white text-lg px-4 py-1 rounded-md transition duration-300 ease-in-out"
                onClick={() => {
                  setSprteRender(
                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokeData.id}.png`
                  );
                }}
              >
                Shiny
              </button>
            </div>
          </div>
          <div>
            <div
              className={`${background[1]} bg-opacity-60 p-4 rounded-lg shadow-lg`}
            >
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <h2 className="text-xl font-bold">Height</h2>
                  <p>{pokeData.height}</p>
                </div>
                <div className="col-span-2">
                  <h2 className="text-xl font-bold">Types</h2>
                  <ul className="flex">
                    {pokeData.types.map((value, index) => {
                      const backgroundColor =
                        typeColors[pokeData.types[index].name] || "bg-gray-200";
                      return (
                        <li
                          className={`mr-2 p-1 w-max rounded-sm ${backgroundColor}`}
                          key={index}
                        >
                          {value.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Weight</h2>
                  <p>{pokeData.weight}</p>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Egg Groups</h2>
                  <p>
                    {pokeData.eggGroups.map((value, index) => {
                      return (
                        <li className="flex" key={index}>
                          {value.name}
                        </li>
                      );
                    })}
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Genus</h2>
                  <p>{pokeData.genus}</p>
                </div>
              </div>
            </div>
            <div
              className={`${background[0]} mt-8 bg-opacity-60 p-4 rounded-lg shadow-lg`}
            >
              <h2 className="text-xl font-bold mb-4">Abilities</h2>
              <ul className="flex">
                {pokeData.abilities.map((value, index) => (
                  <div>
                    <li className="mr-3" key={index}>
                      {value.name}
                    </li>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className={`mt-8 rounded-lg bg-opacity-60 ${background[1]}`}>
          <Bar options={options} data={data} />
        </div>
        <div
          className={`${background[0]} mt-8 bg-opacity-60 p-4 rounded-lg shadow-lg`}
        >
          <h2 className="text-center text-2xl font-bold">Evolutions</h2>
          <ul className="grid justify-center">
            {evolutionChain?.map((value, index) => {
              return (
                <div key={index} className="flex">
                  <div className="mr-9">
                    <img
                      className="w-16"
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeFamilyIds}.png`}
                      alt=""
                    />
                    <li className="font-bold">{basePokemon}</li>
                  </div>
                  <div className="mr-9">
                    <img
                      className="w-16"
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                        pokeFamilyIds + 1
                      }.png`}
                      alt=""
                    />
                    <li className="font-bold">{value.species.name}</li>
                  </div>
                  <ul className="flex">
                    {value.evolves_to.map((evolution, subIndex) => (
                      <li className="font-bold mr-9" key={subIndex}>
                        <img
                          className="w-16"
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                            pokeFamilyIds + 2
                          }.png`}
                          alt=""
                        />
                        {evolution.species.name}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </ul>
        </div>
        <div
          className={`${background[1]} mt-8 bg-opacity-60 p-4 rounded-lg shadow-lg`}
        >
          <h2 className="text-xl font-bold">Description</h2>
          <p>{pokeData.description}</p>
        </div>
      </div>
    </div>
  );
}

export default PokemonPage;
