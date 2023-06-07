import "./App.css";
import LandingPage from "./Components/LandingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PokedexHero from "./Components/PokedexHero";
import PokemonPage from "./Components/PokemonPage";
import WhosThatPokemon from "./Components/WhosThatPokemon";
import PokeFightingLanding from "./Components/PokeFightingLanding";
import PokemonMoveSelection from "./Components/PokemonMoveSelection";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pokemon/:page" element={<PokedexHero />} />
          <Route path="/pokemonPage/:id" element={<PokemonPage />} />
          <Route path="/whosThatPokemon" element={<WhosThatPokemon />} />
          <Route path="/battle" element={<PokeFightingLanding />} />
          <Route
            path="/battle/arena/:player1/:ai"
            element={<PokemonMoveSelection />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
