// import crypto from "crypto";
import { Model, Page, Pojo, QueryBuilder } from "objection";

import omit from "lodash/omit";

// function dateReviver(_: string, value: unknown) {
//   if (isSerializedDate(value)) {
//     return new Date(value);
//   }

//   // If it's not a date-string, we want to return the value as-is. If we fail to return
//   // a value, it will be omitted from the resultant data structure.
//   return value;
// }

// function isSerializedDate(value: unknown): value is string {
//   // Dates are serialized in TZ format, example: '1981-12-20T04:00:14.000Z'.
//   const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

//   return isString(value) && datePattern.test(value);
// }

// const callingMaps: Map<string, PromiseLike<unknown>> = new Map();

class BaseQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<M, R> {
  ArrayQueryBuilderType!: BaseQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: BaseQueryBuilder<M, M>;
  MaybeSingleQueryBuilderType!: BaseQueryBuilder<M, M | undefined>;
  NumberQueryBuilderType!: BaseQueryBuilder<M, number>;
  PageQueryBuilderType!: BaseQueryBuilder<M, Page<M>>;

  //   async cache(ttl = 5): Promise<R> {
  //     // No cache invalidation for now, so just cache for 5 sec
  //     const builder = this.clone();
  //     if (ttl === 0 || !ttl) {
  //       return await builder;
  //     }
  //     // console.log(this.toKnexQuery().toString())
  //     const cacheKey = crypto
  //       .createHash("sha1")
  //       .update(this.toKnexQuery().toString())
  //       .digest("base64");

  //     const entry = await redisClient.get(cacheKey);
  //     if (entry) return JSON.parse(entry, dateReviver);
  //     // Check if key is being processed in callingMaps
  //     if (callingMaps.has(cacheKey)) {
  //       return callingMaps.get(cacheKey) as PromiseLike<R>;
  //     }
  //     let rows: R;
  //     try {
  //       const promise = builder;
  //       // Store key + promise in callingMaps
  //       callingMaps.set(cacheKey, promise);
  //       rows = await promise;
  //     } finally {
  //       // Remove key from callingMaps when done
  //       callingMaps.delete(cacheKey);
  //     }
  //     if (rows) redisClient.set(cacheKey, JSON.stringify(rows), "EX", ttl);
  //     return rows;
  //   }
}

class BaseModel extends Model {
  id!: number;
  createdAt?: Date;
  updatedAt?: Date;
  QueryBuilderType!: BaseQueryBuilder<this>;

  static get modelPaths(): string[] {
    return [__dirname];
  }

  static get QueryBuilder(): typeof QueryBuilder {
    return BaseQueryBuilder;
  }

  get $secureFields(): string[] {
    return [];
  }

  // omit stuff when creating json response from model
  $formatJson(json: Pojo): Pojo {
    json = super.$formatJson(json);
    return omit(json, this.$secureFields);
  }

  $beforeInsert(): void {
    const currentTime = new Date();
    this.createdAt = this.createdAt || currentTime;
    this.updatedAt = currentTime;
  }

  // NOTE: this does not work with upsertGraphAndFetch
  // https://github.com/Vincit/objection.js/issues/2233
  $beforeUpdate(): void {
    delete this.createdAt;
    delete this.updatedAt;
    this.updatedAt = new Date();
  }

  //   static pushToRedisArr(key: string, ids = []): void {
  //     if (ids.length > 0) redisClient.lpush(key, ...ids);
  //   }

  //   static addToRedisSet(key: string, ids = []): void {
  //     if (ids.length > 0) redisClient.sadd(key, ...ids);
  //   }
}

export default BaseModel;
