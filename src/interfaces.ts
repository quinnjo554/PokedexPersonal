export interface MoveLearnset {
  move: {
    name: string;
  };
  version_group_details: {
    level_learned_at: number;
    move_learn_method: {
      name: string;
    };
  }[];
}
export interface Move {
  basePower: number;
  accuracy: number;
  type: string;
}

export interface pokemon{
    name: string;
    id: string;
    types: Type[];
    attack: number;
    defense: number;
    abilities: Ability[];
    description: string;
    eggGroups: EggGroup[];
    genus: string;
    height: string;
    hp: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
    weight: string;
}

export interface evolutionChain{
  evolves_to:evolve_to[],
  species:species
}
export interface species{
  name:string,
  url:string
}
export interface evolve_to{
  species:species,
  evolves_to:evolve_to[]
}

export interface Type{
    id:string,
    name:string
}
export interface Ability {
    id:string,
    name:string
  }
  
  export interface EggGroup {
    id:string,
    name:string
  }
  export interface TypeColors {
    [key: string]: string;
  }

  export const typeColors: TypeColors = {
    normal: 'bg-gray-500',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-500',
    grass: 'bg-green-500',
    ice: 'bg-blue-200',
    fighting: 'bg-red-600',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-700',
    flying: 'bg-blue-300',
    psychic: 'bg-pink-500',
    bug: 'bg-green-700',
    rock: 'bg-gray-700',
    ghost: 'bg-indigo-700',
    dragon: 'bg-indigo-500',
    dark: 'bg-gray-900',
    steel: 'bg-gray-400',
    fairy: 'bg-pink-300',
  };

  export interface PresentPokemonProps {
    page: string;
    selectedPokemon:string
    onPokemonClick: (pokemon: string) => void;
  }