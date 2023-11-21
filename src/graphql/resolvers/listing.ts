import { IPP } from "@/configs/constant";
import { FavoriteAction, ListingResolvers } from "@/generated/graphql";
import listingService from "@/services/listingService";
import { isAuthenticated } from "@/utils/authorization";
import { UserInputError, ValidationError } from "../graphqlError";
import Listing from "@/models/Listing";
import moment from "moment";

const resolver: ListingResolvers = {
  Query: {
    getListingById: async (_, { id }) => {
      return Listing.query().findById(id);
    },
    getListing: async (_, { filter, page = 0, pageSize = IPP }) => {
      const results = await listingService.getListing(
        filter,
        [],
        page,
        pageSize
      );
      return results;
    },
  },
  Mutation: {
    createListing: async (_, { input }, { me }) => {
      isAuthenticated(me);
      const params = {
        ...input,
        title: `Phòng mới được tạo vào lúc ${moment().format("DD/MM/YYYY")}`,
        name: `Phòng mới được tạo vào lúc ${moment().format("DD/MM/YYYY")}`,
        isActive: false,
        userId: me.id,
        explorePicture:
          input?.explorePicture?.map((i: number) => ({ id: i })) || [],
      };

      return await Listing.query().insertGraphAndFetch(params, {
        relate: ["explorePicture"],
      });
    },
    updateListing: async (_, { input, id }, { me }) => {
      isAuthenticated(me);
      const listing = await Listing.query().findById(id);
      if (!listing) throw new ValidationError("INVALID_LISTING");
      const params = {
        ...input,
        id,
        explorePicture:
          input?.explorePicture?.map((i: number) => ({ id: i })) || [],
      };
      return await listing.$query().upsertGraphAndFetch(params, {
        relate: ["explorePicture"],
      });
    },
    favoriteListing: async (_, { action, id }, { me }) => {
      isAuthenticated(me);
      if (!id) throw new UserInputError("Id is required");
      const listing = await Listing.query().findById(id);
      if (!listing) throw new ValidationError("INVALID_LISTING");
      if (action === FavoriteAction.Add) {
        const favorite = await listing
          .$relatedQuery("favorite")
          .where("favorite_listing.targetId", id)
          .where("favorite_listing.fromId", me.id);
        if (favorite?.length) return true;
        await listing.$relatedQuery("favorite").relate(me.id);
        return true;
      } else {
        await listing
          .$relatedQuery("favorite")
          .unrelate()
          .where("favorite_listing.targetId", id)
          .where("favorite_listing.fromId", me.id);
        return true;
      }
    },
  },
  Listing: {
    isMine: async (listing: Listing, _, { me }) => {
      if (!me) return null;
      const { userId } = listing;
      return me.id === userId;
    },
  },
};

export default resolver;
