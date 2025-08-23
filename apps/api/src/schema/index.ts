import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import path,{ dirname }  from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Cargar todos los .graphql de schema y módulos
const typesArray = loadFilesSync([
  path.join(__dirname, "./typeDefs"),
  path.join(__dirname, "../modules/**/*.graphql"),
]);

// Cargar todos los resolvers
const resolversArray = loadFilesSync([
  path.join(__dirname, "./resolvers"),
  path.join(__dirname, "../modules/**/*.resolver.*"),
]);

export const typeDefs = mergeTypeDefs(typesArray);
export const resolvers = mergeResolvers(resolversArray);