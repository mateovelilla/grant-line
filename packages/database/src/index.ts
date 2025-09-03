import mongoose from "mongoose";
import CharacterModel from "./schemas/character.model.js";
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

export function insertCharacters(characters: Character[]) {
	return CharacterModel.insertMany(characters);
}
export function findCharacterById(id: string) {
	return CharacterModel.findById(id);
}
export function findCharacters(character: FilterCharacters) {
	return CharacterModel.find(character);
}
export default function connect() {
	return mongoose.connect(process.env.MONGO_CONNECTION || '');
}
