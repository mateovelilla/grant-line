
import path  from "node:path";
import { loadFilesSync, loadFiles } from "@graphql-tools/load-files";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { __dirname } from "../utils/dirname.js";
const importUrl = import.meta.url
const typesArray = loadFilesSync([
	path.join(__dirname(importUrl), "./typeDefs/*.graphql"),
	path.join(__dirname(importUrl), "../modules/**/*.graphql")
]);
const resolversArray = await loadFiles([
	path.join(__dirname(importUrl), "./resolvers"),
	path.join(__dirname(importUrl), "../modules/**/*.resolver.*"),
], {
	requireMethod: (path: string) => import(path),
	extensions: ["js"] 
});

const typeDefs = await mergeTypeDefs(typesArray);
const resolvers = await mergeResolvers(resolversArray)
export {
	typeDefs,
	resolvers
} 