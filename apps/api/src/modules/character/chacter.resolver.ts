import { IResolvers } from "@graphql-tools/utils"
import BaseScraper from "@grant-line/scraper"
export const resolvers: IResolvers = {
    Mutation: {
        runScraper: async (_parent, args:{}) => {
           const baseScraper = new BaseScraper();
            const response = await baseScraper.init()
            return response
//            return {msg: "Do it!"}
        }
    }
}