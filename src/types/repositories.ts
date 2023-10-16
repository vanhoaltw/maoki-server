import { Author, OrderBy, Quote } from ".";

export interface CreateParameters {
  firstName: string;
  lastName: string;
}

export interface FindParameters {
  first: number;
  after?: number;
  firstName?: string;
  lastName?: string;
  orderBy?: OrderBy[];
}

export interface CountParameters {
  firstName?: string;
  lastName?: string;
}

export interface AuthorRepository {
  get(id: number): Promise<Author>;

  getMany(ids: number[]): Promise<Author[]>;

  create(params): Promise<Author>;

  update(id: number, firstName: string, lastName: string): Promise<Author>;

  find(params): Promise<Author[]>;

  count(params): Promise<number>;

  delete(id: number): Promise<Author>;
}

export interface QuoteRepository {
  get(id: number): Promise<Quote>;

  find(params): Promise<Quote[]>;

  count(params): Promise<number>;
}
