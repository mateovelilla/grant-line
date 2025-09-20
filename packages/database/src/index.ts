const mongoose = require("mongoose");
const CharacterModel = require("./schemas/character.model.js");
export type Character = {
	name?: string;
	year?: number;
	note?: string;
	img?: string;
	description?: string;
	appareance?: string;
};
export type QueryType = {
	$regex: string;
	$options: string;
};
export type FilterCharacters = {
	name: QueryType;
	year: number;
	appareance: QueryType;
	limit: number;
	offset: number;
};

exports.insertCharacters = (characters: Character[]) =>
	CharacterModel.insertMany(characters);
exports.findCharacterById = (id: string) => CharacterModel.findById(id);
exports.findCharacters = ({ limit, offset, ...params }: FilterCharacters) => {
	return CharacterModel.find(params).skip(offset).limit(limit);
};
exports.countCharacters = () => CharacterModel.countDocuments({});
const connect = () => {
	console.log(process.env.MONGO_CONNECTION, "Connecction 🌛🌛🌛🌛");
	return mongoose.connect(process.env.MONGO_CONNECTION || "");
};
export {
	 connect
};
