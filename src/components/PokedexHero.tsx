import React, { ChangeEvent, useEffect, useState } from "react";
import {
  getAllPokemon,
  getPokemonByAbility,
  getPokemonByName,
  getRandomPokemon,
} from "../Pokefunctions/getFunctions";
import { Link, useParams } from "react-router-dom";
import { pokemon } from "../interfaces";
import { TypeColors } from "../interfaces";
import { typeColors } from "../interfaces";
import LandingNav from "./LandingNav";
import backArrow from "../assets/icons8-back-arrow-100.png";
import { useRef } from "react";
import { getPokemonByType } from "../Pokefunctions/getFunctions";
import Tilt from "react-parallax-tilt";

//ask sully or steve about how they would gothrough the evolution chain in the pokedex
//add random pokemon button
function PokedexHero() {
  const [pokeArray, setPokeArray] = useState<Array<pokemon>>([]);
  const [pokemonPages, setPokemonPages] = useState(0);
  const [pageNum, setPageNum] = useState(0);
  const [searchOption, setSearchOption] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [randomPokemonId, setRandomPokemonId] = useState(0);
  const { page } = useParams();
  const inputRef = useRef<HTMLInputElement>(null);
  //need for filtering
  const [allPokemon, setAllPokemon] = useState<Array<pokemon>>([]);

  //filer for name
  const filteredSearch = searchOption
    ? allPokemon.filter((item) =>
        item.name.toLowerCase().includes(searchInput.toLowerCase())
      )
    : [];
  //filter for type
  const filteredSearchType = searchOption
    ? allPokemon.filter((item, index, self) => {
        const lowerCaseSearchInput = searchInput.toLowerCase();
        return (
          item.types[0].name.toLowerCase().includes(lowerCaseSearchInput) &&
          self.findIndex((elem) => elem.name === item.name) === index
        );
      })
    : [];

  //filter for abilities
  const filteredSearchAbilities = searchOption
    ? allPokemon.filter((item, index, self) => {
        const lowerCaseSearchInput = searchInput.toLowerCase();
        return (
          item.abilities[0].name.toLowerCase().includes(lowerCaseSearchInput) &&
          self.findIndex((elem) => elem.name === item.name) === index
        );
      })
    : [];

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
  const handleSearch = async () => {
    const searchTerm = searchInput;
    if (searchTerm) {
      let data;
      switch (searchOption) {
        case "types":
          data = await getPokemonByType(searchTerm, pageNum);
          setPokeArray(data["content"]);
          setPokemonPages(data["totalPages"]);
          break;
        case "ability":
          data = await getPokemonByAbility(searchTerm, pageNum);
          setPokeArray(data["content"]);
          setPokemonPages(data["totalPages"]);
          break;
        case "name":
          data = await getPokemonByName(searchTerm);
          setPokeArray([data]);
          setPokemonPages(0);
          break;
        default:
          data = await getAllPokemon(page);
          break;
      }
      setShowFilter(false);
    } else {
      const data = await getAllPokemon(page);
      setPokeArray(data["content"]);
      setPokemonPages(data["totalPages"]);
    }
  };

  function handleFilterOnClick(value: pokemon) {
    switch (searchOption) {
      case "types":
        setSearchInput(value.types[0].name);
        if (inputRef.current) {
          inputRef.current.value = value.types[0].name;
        }
        break;
      case "ability":
        setSearchInput(value.abilities[0].name);
        if (inputRef.current) {
          inputRef.current.value = value.abilities[0].name;
        }
        break;
      case "name":
        setSearchInput(value.name);
        if (inputRef.current) {
          inputRef.current.value = value.name;
        }
        break;
      default:
        setSearchInput(value.name);
        if (inputRef.current) {
          inputRef.current.value = value.name;
        }
        break;
    }

    setShowFilter(false);
  }

  function handleInputOnChange(event: ChangeEvent<HTMLInputElement>) {
    const current = event.target.value;
    setSearchInput(current);
    setShowFilter(current !== "");
  }

  useEffect(() => {
    async function getRandPokemon() {
      getRandomPokemon().then((data) => {
        setRandomPokemonId(data.id);
      });
    }
    getRandPokemon();
  }, []);

  useEffect(() => {
    async function getAllpokemonForFilter() {
      const allData = await getAllPokemon("0", 550);
      setAllPokemon(allData["content"]);
    }
    getAllpokemonForFilter();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [inputRef.current, pageNum, page]);

  useEffect(() => {
    const fetchData = async () => {
      //for presenting
      const data = await getAllPokemon(page);
      setPokeArray(data["content"]);
      setPokemonPages(data["totalPages"]);
    };

    fetchData();

    setPageNum(Number(page));
  }, [page]);

  return (
    //make load more and back imgs below the nav
    <div className="pokedex-hero">
      <Link
        to={`/pokemon/${getNextPageNumber(Number(page), 1, 0, pokemonPages)}`}
      >
        <img
          src={backArrow}
          className="w-16 absolute rotate-180 right-6 top-24 rounded-full bg-white hover:bg-transparent transition-all ease-in-out"
          alt=""
          onClick={() => {
            setPageNum((prevPageNum) =>
              getNextPageNumber(prevPageNum, 1, 0, pokemonPages)
            );
          }}
        />
      </Link>
      <Link
        to={`/pokemon/${getNextPageNumber(Number(page), -1, 0, pokemonPages)}`}
      >
        <img
          src={backArrow}
          className="w-16 absolute left-6 top-24 rounded-full bg-white hover:bg-transparent transition-all ease-in-out"
          alt=""
          onClick={() => {
            setPageNum((prevPageNum) =>
              getNextPageNumber(prevPageNum, -1, 0, pokemonPages)
            );
          }}
        />
      </Link>
      <Link to={`/whosThatPokemon`}>
        <button className="whosThatpoke fixed right-5 bg-slate-50 p-2 top-5 rounded-md z-20 hover:bg-gray-300 transition-all ease-in-out">
          Who's That Pokemon?
        </button>
      </Link>
      <div className="searchBar fixed right-[60%] top-5 z-10">
        <input
          className="bg-slate-50 fixed right-[30%] w-[30%] top-6 h-8 p-3 rounded-md z-20"
          ref={inputRef}
          type="text"
          onChange={handleInputOnChange}
        />
        {showFilter && (
          <div className="absolute left-32 top-8 bg-white text-black mt-1 rounded overflow-y-auto max-h-40">
            <ul>
              {searchOption === "name"
                ? filteredSearch.map((value, index) => (
                    <Link to={`/pokemonPage/${value.id}`}>
                      <li
                        key={index}
                        onClick={() => handleFilterOnClick(value)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                      >
                        {value.name}
                      </li>
                    </Link>
                  ))
                : searchOption === "types"
                ? filteredSearchType.map((value, index) => (
                    <li
                      key={index}
                      onClick={() => handleFilterOnClick(value)}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    >
                      {value.types[0].name}
                    </li>
                  ))
                : searchOption === "ability" &&
                  filteredSearchAbilities.map((value, index) => (
                    <li
                      key={index}
                      onClick={() => handleFilterOnClick(value)}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    >
                      {value.abilities[0].name}
                    </li>
                  ))}
            </ul>
          </div>
        )}

        <select
          className="bg-slate-50 w-26 relative ml-auto mr-3 z-10 top-1 p-1 rounded-md"
          value={searchOption}
          onChange={(e) => setSearchOption(e.target.value)}
        >
          <option value="all">All Pokemon</option>
          <option value="types">Type</option>
          <option value="ability">Ability</option>
          <option value="name">Name</option>
        </select>
        <button
          className="bg-slate-50 fixed left-[67%] top-6 border-x-2 z-20 p-1 rounded-md"
          onClick={handleSearch}
        >
          Search
        </button>
        <Link
          to={`http://localhost:5173/pokemonPage/${randomPokemonId}`}
          className="bg-slate-200 p-2 mr-2 relative top-1 rounded-md hover:bg-gray-300"
        >
          Random
        </Link>
      </div>

      <LandingNav hasButtons={false}></LandingNav>
      <ul className="p-24 ml-8 grid grid-cols-1 gap-2 gap-x-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {pokeArray.map((value, index) => {
          return (
            <Link to={`/pokemonPage/${value["id"]}`} key={index}>
              <div className="pokemon-card w-48 p-2 grid rounded-md mt-3 transition-all ease-in-out bg-black bg-opacity-70 text-white ">
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
                  <ul className="flex">
                    {value["types"].map((type, typeIndex) => {
                      const typeName = type.name.toLowerCase();
                      const backgroundColor =
                        typeColors[typeName] || "bg-gray-300";
                      return (
                        <li
                          className={`flex px-2 mr-2 rounded-sm ${backgroundColor}`}
                          key={typeIndex}
                        >
                          {type.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}

export default PokedexHero;
