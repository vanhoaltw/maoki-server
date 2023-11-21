import listingResolver from "./listing";
import { mergeResolvers } from "@graphql-tools/merge";

const resolvers = [listingResolver];

export default mergeResolvers(resolvers);
