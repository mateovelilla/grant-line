// import { loadFilesSync } from "@graphql-tools/load-files";
// import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
// import path, { dirname } from "node:path";
// import { fileURLToPath } from "node:url";
const { loadFilesSync } = require("@graphql-tools/load-files");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge")
const path = require("node:path");


const typesArray = loadFilesSync([
	path.join(__dirname, "./typeDefs"),
	path.join(__dirname, "../modules/**/*.graphql"),
]);

const resolversArray = loadFilesSync([
	path.join(__dirname, "./resolvers"),
	path.join(__dirname, "../modules/**/*.resolver.*"),
]);

exports.typeDefs = mergeTypeDefs(typesArray);
exports.resolvers = mergeResolvers(resolversArray);
