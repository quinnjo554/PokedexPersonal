
import * as GetFunctions from "../Pokefunctions/getFunctions"
import { pokemon } from "../interfaces";
const {} = jest.requireActual<typeof GetFunctions>("../Pokefunctions/getFunctions")




  async function getData(id:string | undefined){
    const data:pokemon = await GetFunctions.getPokemonById(id);
    return data
  }

  describe('Get Pokemon Id', () => {
    it('should fetch a paginated list of all pokemon', async () => {
      const page = "1";
      const data:pokemon = await GetFunctions.getPokemonById(page);
      console.log(data.name)
      expect(data.name).toBe("Bulbasaur")
    });
  });
  
