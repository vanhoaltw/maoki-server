import { AuthenticationError } from "@/graphql/graphqlError";
import { User } from "@/models";

export const isAuthenticated = (me: User): void => {
  if (!me && !me?.isAvailable) {
    throw new AuthenticationError("Not authenticated as user.");
  }
};
