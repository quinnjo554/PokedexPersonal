import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import {
  getAllPokemon,
  getPokeIdByName,
  getRandomPokemon,
} from "../Pokefunctions/getFunctions";
import { pokemon } from "../interfaces";
import { startStarfieldAnimation } from "../starfield";
import { fetchData } from "../ComponenetFunctions/WhosThatPokemonFunctions";

function WhosThatPokemon() {
  // State variables
  const [pokemonId, setPokemonId] = useState<number | undefined>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [Pokemon, setPokemon] = useState<pokemon>();
  const [isBlurred, setIsBlurred] = useState("");
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [endText, setEndText] = useState("");
  const [canGuess, setCanGuess] = useState("visible");
  const [canProceed, setCanProceed] = useState("hidden");
  const [pokeArray, setPokeArray] = useState<Array<pokemon>>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [pokeImg, setPokeImg] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  //Filter based on user guess
  const filteredSearch = guess
    ? pokeArray.filter((item) =>
        item.name.toLowerCase().includes(guess.toLowerCase())
      )
    : [];

  //fetch the rand pokemon on load and when the score changes
  //being called twice because of strict mode
  useEffect(() => {
    fetchData(setPokemon, setPokemonId, setPokeImg, setIsLoading);
  }, []);

  //load the background ani and get all pokemon for filtering
  useEffect(() => {
    startStarfieldAnimation(canvasRef);
    getAllPokemon("0", 550).then((data) => {
      setPokeArray(data["content"]);
      console.log(data["content"]);
    });
  }, [score]);

  //handle user guess
  const handleGuessChange = (event: ChangeEvent<HTMLInputElement>) => {
    const current = event.target.value;
    setGuess(current);
    setShowFilter(current !== "");
  };

  const handleFilteredGuessClick = (name: string) => {
    setGuess(name);
    if (inputRef.current) {
      inputRef.current.value = name;
    }
    setShowFilter(false);
  };

  const handleSubmit = () => {
    setShowFilter(false);
    setIsBlurred("filter-none");
    setCanGuess("hidden");
    const pokename = Pokemon?.name;
    if (guess.toLowerCase() === pokename?.toLowerCase()) {
      setEndText("You got it! It's " + Pokemon?.name);
      setCanProceed("visible");
    } else {
      setEndText("Good try! But it's " + Pokemon?.name);
    }
  };

  function setUpValuesForNewPokemon() {
    setIsBlurred("");
    setCanGuess("visible");
    setCanProceed("hidden");
    setEndText("");
    setScore((prev) => prev + 1);
  }

  const handleNext = () => {
    setUpValuesForNewPokemon();
    getRandomPokemon().then((data) => {
      const name = data?.name;
      setPokemon(data);
      if (name) {
        const lowercaseName = name.toLowerCase();
        getPokeIdByName(lowercaseName).then((id) => {
          setPokemonId(id?.id);
        });
      }
    });
  };

  return (
    <div className="whosThatPoke flex flex-col items-center justify-center min-h-screen text-white">
      <canvas ref={canvasRef} className="starfield-canvas bg-black" />
      {isLoading ? (
        <p>Loading...</p>
      ) : pokemonId ? (
        <div className="flex flex-col items-center z-10">
          <h1 className="text-4xl font-bold mb-4">{score}</h1>
          <img
            className={`contrastImg ${isBlurred} pokeSillowette col transition-all ease-in-out`}
            src={pokeImg}
            alt="Pokemon"
          />
          <h1 className="text-xl mt-4 text-center">
            {Pokemon?.description.replace(Pokemon.name, "-------")}
          </h1>
          <div className="flex items-center mt-4">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                name="guess"
                id="guess"
                className="px-4 py-2 mr-2 border text-black border-gray-300 rounded"
                onChange={handleGuessChange}
              />
              {showFilter && (
                <div className="absolute left-0 right-0 bg-white text-black mt-1 rounded overflow-y-auto max-h-40">
                  <ul>
                    {filteredSearch.map((value, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleFilteredGuessClick(value.name)}
                      >
                        {value.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={handleSubmit}
              className={`px-4 py-2 mr-2 bg-blue-500 text-white rounded ${
                canGuess === "hidden" ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={canGuess === "hidden"}
            >
              Guess
            </button>
            <button
              onClick={handleNext}
              className={`px-4 py-2 bg-green-500 text-white rounded ${
                canProceed === "hidden" ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={canProceed === "hidden"}
            >
              Next
            </button>
          </div>
          <h1 className="mt-4 text-2xl">{endText}</h1>
        </div>
      ) : null}
    </div>
  );
}

export default WhosThatPokemon;
