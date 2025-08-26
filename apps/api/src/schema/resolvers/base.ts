import type { IResolvers } from "@graphql-tools/utils";

export const resolvers: IResolvers = {
	Query: {
		_empty: () => "API is running 🚀",
	},
	Mutation: {
		_empty: () => "API is running 🚀",
	},
};
