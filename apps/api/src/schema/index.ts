const path = require("node:path");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");

const typesArray = loadFilesSync([
	path.join(__dirname, "./typeDefs"),
	path.join(__dirname, "../modules/**/*.graphql"),
]);

const resolversArray = loadFilesSync([
	path.join(__dirname, "./resolvers"),
	path.join(__dirname, "../modules/**/*.resolver.*"),
]);

module.exports = {
	typeDefs: mergeTypeDefs(typesArray),
	resolvers: mergeResolvers(resolversArray),
};
