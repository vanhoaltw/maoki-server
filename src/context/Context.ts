import QuoteKnexRepository from "@/repositories/QuoteKnexRepository";
import { Author } from "@/types";
import { AuthorRepository } from "@/types/repositories";
import DataLoader from "dataloader";

interface RepositoriesContext {
  author: AuthorRepository;
  quote: QuoteKnexRepository;
}

interface LoadersContext {
  author: DataLoader<number, Author>;
}

export default interface Context {
  repositories: RepositoriesContext;
  loaders: LoadersContext;
}
