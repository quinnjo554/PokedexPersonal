import React, { useEffect } from "react";
import Pokeball from "../assets/file-pokeball-png-0.png";
import { Link } from "react-router-dom";

function LandingNav(props: { hasButtons: boolean }) {
  return (
    <div className="fixed top-0 w-full h-20 rounded-md bg-black shadow-md shadow-gray-400">
      <div className="content">
        <div>
          <img
            src={Pokeball}
            alt=""
            width={"60px"}
            height={"60px"}
            className="fixed top-2 ml-3"
          />
          <h1 className="fixed left-24 top-5 text-2xl w-max font-semibold text-white">
            Pokedex
          </h1>
        </div>
        <div className="list flex justify-end mr-10">
          {props.hasButtons && (
            <ul className="flex mt-5">
              <Link to={"/pokemon/0"}>
                <li className="mr-3 bg-blue-500 p-2 text-white rounded-md">
                  Try Now
                </li>
              </Link>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingNav;
