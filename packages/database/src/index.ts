import mongoose from "mongoose";
import { CharacterModel } from "./schemas/character.model.js";
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

const insertCharacters = (characters: Character[]) =>
	CharacterModel.insertMany(characters);
const findCharacterById = (id: string) => CharacterModel.findById(id);
const findCharacters = ({ limit, offset, ...params }: FilterCharacters) => {
	return CharacterModel.find(params).skip(offset).limit(limit);
};
const countCharacters = () => CharacterModel.countDocuments({});
const connect = () => {
	console.log(process.env.MONGO_CONNECTION, "Connecction 🌛🌛🌛🌛");
	return mongoose.connect(process.env.MONGO_CONNECTION || "");
};
export {
	connect,
	insertCharacters,
	findCharacterById,
	findCharacters,
	countCharacters,
};
