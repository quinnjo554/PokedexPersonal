import React from "react";
import { Link } from "react-router-dom";

function LandingHero() {
  return (
    <div className="hero fixed top-20 z-[-1] w-full h-full bg-gray-400">
      <div className="card" id="pokecard">
        <div className="card-content">
          <h1 className="title">Pokedex</h1>
          <p className="card-body">Battle with Your favorite pokemon</p>
          <Link to={"/battle"} className="button">
            Battle
          </Link>
        </div>
      </div>
      <div className="heroText fixed w-max left-[15%]">
        <div className="hero-content w-1/2">
          <h1 className="text-white text-5xl mb-3 font-semibold font-sans">
            Pokedex
          </h1>
          <p className="text-white text-lg font-medium">
            tenetur suscipit rem ducimus aliquam possimus nobis illo natus quos
            ad libero doloremque eligendi facere aperiam, optio fuga architecto
            atque officia molestias culpa nihil. Ducimus.
          </p>
          <Link to={"/pokemon/0"}>
            <button className="button text-white mt-4 shadow-md shadow-white hover:shadow-none ease-in-out">
              Try For Free
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingHero;
