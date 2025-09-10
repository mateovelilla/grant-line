const base_url = process.env.BASE_URL_SCRAPER || '';
const list_url = base_url + process.env.LIST_URL_SCRAPER || '';
const { CharacterController } = require("./character.controller")
const {runScaper, findCharacter, findCharacters} = new CharacterController();
const resolvers = {
	Mutation: {
		runScraper: runScaper,
	},
	Query: {
		character: findCharacter,
		characters: findCharacters,
	},
};
module.exports = { resolvers };
