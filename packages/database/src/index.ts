const mongoose = require("mongoose")
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
}
export type FilterCharacters = {
	name: QueryType;
	year: number;
	appareance: QueryType;
}

exports.insertCharacters =  function(characters: Character[]) {
	return CharacterModel.insertMany(characters);
}
exports.findCharacterById = function(id: string) {
	return CharacterModel.findById(id);
}
exports.findCharacters = function (character: FilterCharacters) {
	return CharacterModel.find(character);
}
exports.connect =  function() {
	return mongoose.connect(process.env.MONGO_CONNECTION || '');
}