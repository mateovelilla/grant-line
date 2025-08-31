import mongoose from "mongoose";
import CharacterModel from "./schemas/character.model";
export type Character = {
	name?: string;
	year?: number;
	note?: string;
	img?: string;
	description?: string;
	appareance?: string;
};

export function insertCharacters(characters: Character[]) {
	return CharacterModel.insertMany(characters);
}
export function findCharacterById(id: string) {
	return CharacterModel.findById(id);
}
export function findCharacters(character: Character) {
	return CharacterModel.find(character);
}
export async function connect() {
	await mongoose.connect(process.env.MONGO_CONNECTION);
	console.log("Mongo database connected!");
}
