const { model, Schema } = require("mongoose");
const Document = require("mongoose").Document;

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

const character = new Schema();
const CharacterModel = model("character", character);

module.exports = CharacterModel;
