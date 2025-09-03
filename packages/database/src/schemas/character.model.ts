import { Schema, model, Document } from 'mongoose';
export interface ICharacter extends Document {
	name: string;
	link: string;
	year: number;
	note: string;
	img: string;
	description: string;
	appareance: string;
	createdAt: Date;
	updateAt: Date;
}

const character = new Schema<ICharacter>({
	name: String,
	link: String,
	year: Number,
	note: String,
	img: String,
	description: String,
	appareance: String,
	createdAt: { type: Date, default: Date.now },
	updateAt: { type: Date, default: Date.now },
});
const CharacterModel = model<ICharacter>("character", character);

export default CharacterModel;
