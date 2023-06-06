
import * as GetFunctions from "../Pokefunctions/getFunctions"
import { capitalizeFirstLetter } from "../Pokefunctions/getFunctions";
const {} = jest.requireActual<typeof GetFunctions>("../Pokefunctions/getFunctions")

  //ask steve about testing with async 
  describe('Get Pokemon Id', () => {
    it('should fetch a paginated list of all pokemon', () => {
      const word = "mars";
        const result = capitalizeFirstLetter(word);
        expect(result).toBe("Mars");
    });
  });
  
