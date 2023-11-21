import { CreateListingInput, ListingPagination } from "@/generated/graphql";
import BaseService, { FilterOpts, SortOpts } from "./baseService";
import Listing from "@/models/Listing";

class ListingService extends BaseService<Listing> {
  async getListing(
    filter?: FilterOpts[],
    sort?: SortOpts[],
    page?: number,
    pageSize?: number
  ): Promise<ListingPagination> {
    const { results, total } = await this.sortJson(
      this.filterJson(Listing.query(), filter),
      sort
    ).page(page, pageSize);

    return { results, total, page, pageSize };
  }

  async create(input: CreateListingInput): Promise<Listing> {
    const params = {
      ...input,
      isActive: false,
      explorePicture:
        input?.explorePicture?.map((i: number) => ({ id: i })) || [],
    };

    return await Listing.query().insertGraphAndFetch(params, {
      relate: ["category", "topic"],
    });
  }
}

export default new ListingService(new Listing());
