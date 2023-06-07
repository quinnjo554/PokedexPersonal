import { getRandomPokemon, getPokeIdByName } from "../Pokefunctions/getFunctions";
import { pokemon } from "../interfaces";


//useEffect
export async function fetchData(
  setPokemon: React.Dispatch<React.SetStateAction<pokemon | undefined>>,
  setPokemonId: React.Dispatch<React.SetStateAction<number | undefined>>,
  setPokeImg: React.Dispatch<React.SetStateAction<string>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
){
    const data = await getRandomPokemon();
    const name = data?.name;
    setPokemon(data);
    if (name) {
      const lowercaseName = name.toLowerCase();
      const id = await getPokeIdByName(lowercaseName);
      setPokemonId(id?.id);
      setPokeImg(
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id?.id}.png`
      );
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };