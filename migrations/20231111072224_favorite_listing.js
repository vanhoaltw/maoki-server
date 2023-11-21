/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("favorite_listing", (table) => {
    table.increments("id").primary();
    table.integer("listingId").references("listing.id").onDelete("CASCADE");
    table.integer("userId").references("user.id").onDelete("CASCADE");
    table.index("userId");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("favorite_listing");
};
