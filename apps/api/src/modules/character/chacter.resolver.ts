import { CharacterController } from "./character.controller.js";
const { runScaper, findCharacter, findCharacters } = new CharacterController();
const resolvers = {
	Mutation: {
		runScraper: runScaper,
	},
	Query: {
		character: findCharacter,
		characters: findCharacters,
	},
};
export { resolvers };
