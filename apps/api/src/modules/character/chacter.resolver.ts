const { CharacterController } = require("./character.controller");
const { runScaper, findCharacter, findCharacters } = new CharacterController();
const resolvers = {
	Mutation: {
		runScraper: runScaper,
	},
	Query: {
		character: findCharacter,
		characters: findCharacters
	},
};
module.exports = { resolvers };
