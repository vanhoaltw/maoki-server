import { User } from "@/models";
import BaseModel from "@/models/Base";
import { GraphQLResolveInfo, SelectionNode } from "graphql";
import { QueryBuilder } from "objection";

export interface FilterOpts {
  field: string;
  operator: string;
  value: any;
}

export interface SortOpts {
  field: string;
  value: "asc" | "desc";
}

export interface IPaginateParams {
  page: number;
  pageSize: number;
  sort?: SortOpts[];
  filter?: FilterOpts[];
  eagerLoad?: string;
  me?: User;
}

class BaseService<T extends BaseModel> {
  protected model: T;
  constructor(model: T) {
    this.model = model;
  }

  prefixModelName(filter: FilterOpts[], name: string): FilterOpts[] {
    return (
      Array.isArray(filter) &&
      filter.map((opt) => {
        if (opt.field && opt.field.includes(".")) return opt;
        opt.field = `${name}.${opt.field}`;
        return opt;
      })
    );
  }

  sortJson<R extends QueryBuilder<T, T[]>>(
    originalQuery: R,
    sorts: SortOpts[]
  ): R {
    if (sorts?.length > 0) {
      try {
        sorts.forEach((item) => {
          originalQuery.orderBy(item.field, item.value);
        });
        return originalQuery;
      } catch (e) {
        console.log(e);
        // throw new UserInputError("Wrong input sort");
      }
    }
    return originalQuery;
  }

  filterJson<R extends QueryBuilder<T, T[]>>(
    originalQuery: R,
    filter: FilterOpts[]
  ): R {
    if (filter?.length > 0) {
      try {
        let _query = originalQuery;
        filter.forEach((item) => {
          _query = this.buildWhereClause(_query, item);
        });
        return _query;
      } catch (e) {
        console.log(e);
        // throw new UserInputError("Wrong input filter");
      }
    }
    return originalQuery;
  }

  getFields(selections: readonly SelectionNode[]): string[] {
    const fields = [];
    selections.forEach((s) => {
      if (s.kind === "Field") {
        fields.push(s.name.value);
        if (s.selectionSet) {
          fields.push(...this.getFields(s.selectionSet.selections));
        }
      }
    });
    return fields;
  }

  // Note this only work if relation and field name are exactly the same
  builWithGraphFetchClause(
    ctx: GraphQLResolveInfo,
    fieldName: string[]
  ): string {
    const selections = ctx.fieldNodes[0].selectionSet.selections;
    const fields = this.getFields(selections);
    const inSelection = fieldName.filter((s) => {
      const parentField = s.split(".")[0];
      return fields.includes(parentField);
    });
    return `[${inSelection.join()}]`;
  }

  buildWhereClause<R extends QueryBuilder<T, T[]>>(
    qb: R,
    { field, operator, value }: FilterOpts
  ): R {
    if (Array.isArray(value) && !["or", "in", "nin"].includes(operator)) {
      return qb.where((subQb) => {
        for (const val of value) {
          subQb.orWhere((q) =>
            this.buildWhereClause(q, { field, operator, value: val })
          );
        }
      });
    }

    switch (operator) {
      case "or":
        return qb.where((orQb) => {
          value.forEach((orClause) => {
            orQb.orWhere((subQb) => {
              if (Array.isArray(orClause)) {
                orClause.forEach((orClause) =>
                  subQb.where((andQb) =>
                    this.buildWhereClause(andQb, { ...orClause })
                  )
                );
              } else {
                this.buildWhereClause(subQb, { ...orClause });
              }
            });
          });
        });
      case "eq":
        return qb.where(field, value);
      case "ne":
        return qb.where(field, "!=", value);
      case "lt":
        return qb.where(field, "<", value);
      case "lte":
        return qb.where(field, "<=", value);
      case "gt":
        return qb.where(field, ">", value);
      case "gte":
        return qb.where(field, ">=", value);
      case "in":
        return qb.whereIn(field, Array.isArray(value) ? value : [value]);
      case "nin":
        return qb.whereNotIn(field, Array.isArray(value) ? value : [value]);
      case "contains":
        return qb.whereRaw("?? ILIKE ?", [field, `%${value}%`]);
      case "ncontains":
        return qb.whereRaw(`COALESCE(??, '') NOT ILIKE ?`, [
          field,
          `%${value}%`,
        ]);
      case "containss":
        return qb.where(field, "like", `%${value}%`);
      case "like":
        return qb.where(field, "like", `%${value}%`);
      case "ncontainss":
        return qb.whereNot(field, "like", `%${value}%`);
      case "fts":
        return qb.whereRaw(`?? @@ plainto_tsquery('english', ?)`, [
          field,
          value,
        ]);
      case "isnot":
        return qb.whereRaw(`?? is not ${!!value}`, [field]);
      case "null": {
        return value ? qb.whereNull(field) : qb.whereNotNull(field);
      }
      default:
        throw new Error(
          `Unhandled whereClause : ${field} ${operator} ${value}`
        );
    }
  }
}

export default BaseService;
