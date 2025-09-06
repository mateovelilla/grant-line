const { model, Schema } = require("mongoose");

const character = new Schema({
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
const CharacterModel = model("character", character);

module.exports = CharacterModel;
