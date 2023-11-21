import { ForbiddenError } from "@/graphql/graphqlError";
import { GraphQLFormattedError } from "graphql";
import { unwrapResolverError } from "@apollo/server/errors";
import { DBError } from "objection";
import { encryptString } from "@/utils/string";

export function formatErrorMiddleware(formattedError: GraphQLFormattedError, error: any) {
  if (process.env.NODE_ENV === "production") {
    delete formattedError.extensions.stacktrace;
  }
  if (error?.extensions?.response?.status == 403) {
    return new ForbiddenError(error?.message);
  }

  if (error?.message == "PersistedQueryNotFound") {
    return formattedError;
  }

  if (unwrapResolverError(error) instanceof DBError) {
    return {
      message: "INTERNAL_SERVER_ERROR",
      path: error.path,
      extensions: {
        code:
          process.env.NODE_ENV === "production"
            ? encryptString(error.message || error.stacktrace)
            : error.message || error.stacktrace,
      },
    };
  }

  return formattedError;
}
