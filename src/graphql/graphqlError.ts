import { ASTNode, GraphQLError, GraphQLFormattedError, Source, SourceLocation } from 'graphql'

function toGraphQLError(error): GraphQLError {
  return new GraphQLError(error.message, {
    nodes: error?.nodes,
    source: error?.source,
    positions: error?.positions,
    path: error?.path,
    originalError: error?.originalError,
    extensions: error?.extensions,
  })
}

export class ApolloError extends Error implements GraphQLError {
  public extensions: Record<string, any>
  override readonly name!: string
  readonly locations: ReadonlyArray<SourceLocation> | undefined
  readonly path: ReadonlyArray<string | number> | undefined
  readonly source: Source | undefined
  readonly positions: ReadonlyArray<number> | undefined
  readonly nodes: ReadonlyArray<ASTNode> | undefined
  public originalError: Error | undefined;

  [key: string]: any

  constructor(message: string, code?: string, extensions?: Record<string, any>) {
    super(message)

    if (!this.name) {
      Object.defineProperty(this, 'name', { value: 'ApolloError' })
    }
    this.extensions = { ...extensions, code }
  }
  toJSON(): GraphQLFormattedError {
    throw toGraphQLError(this).toJSON()
  }

  override toString(): string {
    throw toGraphQLError(this).toString()
  }

  get [Symbol.toStringTag](): string {
    return this.name
  }
}

export class ValidationError extends ApolloError {
  constructor(message: string) {
    super(message, 'GRAPHQL_VALIDATION_FAILED')

    Object.defineProperty(this, 'name', { value: 'ValidationError' })
  }
}

export class AuthenticationError extends ApolloError {
  constructor(message: string, extensions?: Record<string, any>) {
    super(message, 'UNAUTHENTICATED', extensions)
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' })
  }
}

export class ForbiddenError extends ApolloError {
  constructor(message: string, extensions?: Record<string, any>) {
    super(message, 'FORBIDDEN', extensions)

    Object.defineProperty(this, 'name', { value: 'ForbiddenError' })
  }
}

export class PersistedQueryNotFoundError extends ApolloError {
  constructor() {
    super('PersistedQueryNotFound', 'PERSISTED_QUERY_NOT_FOUND')

    Object.defineProperty(this, 'name', {
      value: 'PersistedQueryNotFoundError',
    })
  }
}

export class PersistedQueryNotSupportedError extends ApolloError {
  constructor() {
    super('PersistedQueryNotSupported', 'PERSISTED_QUERY_NOT_SUPPORTED')

    Object.defineProperty(this, 'name', {
      value: 'PersistedQueryNotSupportedError',
    })
  }
}

export class UserInputError extends ApolloError {
  constructor(message: string, extensions?: Record<string, any>) {
    super(message, 'BAD_USER_INPUT', extensions)

    Object.defineProperty(this, 'name', { value: 'UserInputError' })
  }
}
