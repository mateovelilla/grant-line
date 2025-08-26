import mongoose from "mongoose"
import CharacterModel from "./schemas/character.model";
export type Character = {
    name: String;
    year: Number;
    note: String;
    img: String;
    description: String;
    appareance: String;
};
export function insertCharacters (characters: Character[]) {
    return CharacterModel.insertMany(characters)
}
export async function connect() {
    await mongoose.connect(process.env.MONGO_CONNECTION)
    console.log('Mongo database connected!')
}