import { IResolvers } from "@graphql-tools/utils";

const users = [
  { id: "1", name: "Mateo" },
  { id: "2", name: "Velilla" },
];

export const resolvers: IResolvers = {
  Query: {
    user: (_parent, args: { id: string }) => users.find(u => u.id === args.id),
    users: () => users,
  },
};
