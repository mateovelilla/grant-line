const mongoose = require("mongoose");
const CharacterModel = require("./schemas/character.model");

// import mongoose from "mongoose";
// import CharacterModel from "./schemas/character.model";
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
};

exports.insertCharacters = (characters: Character[]) =>
	CharacterModel.insertMany(characters);
exports.findCharacterById = (id: string) => CharacterModel.findById(id);
exports.findCharacters = (character: FilterCharacters) =>
	CharacterModel.find(character);
exports.connect = () => mongoose.connect(process.env.MONGO_CONNECTION || "");
