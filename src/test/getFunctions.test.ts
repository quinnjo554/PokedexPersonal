//import { capitalizeFirstLetter } from "../Pokefunctions/getFunctions";
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
  describe('Capitalize the first Letter', () => {
    it('should capitalize the first', () => {
        const word = "mars";
        const result = capitalizeFirstLetter(word);
        console.log(result)
        expect(result).toBe("Mars");
    });
  });
  
 