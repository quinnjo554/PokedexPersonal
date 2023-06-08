import { toLowercaseName } from "../Pokefunctions/getFunctions";

  describe('Make the first Letter Lowercase', () => {
    it('should capitalize the first', () => {
      const word = "Mars";
        const result = toLowercaseName(word);
        console.log(result)
        expect(result).toBe("mars");
    });
  });
  
 