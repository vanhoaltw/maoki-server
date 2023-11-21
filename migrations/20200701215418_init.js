exports.up = (knex) => {
  return (
    knex.schema
      // USER
      .createTable("user", (table) => {
        table.increments("id").primary();
        table.specificType('sids', 'int[]').defaultTo(null)
        table.string("firstName", 255).notNullable();
        table.string("lastName", 255).notNullable();
        table.string("username", 255).notNullable();
        table.string("email", 50).notNullable();
        table.json("identityVerificationTypes").default([]);
        table.string("passwordHash", 32).notNullable();
        table.timestamp("birthday");
        table.string("bio");
        table.string("titleText");
        table.string("gender");
        table.string("avatar");
        table.string("favoriteSong");
        table.string("work");
        table.string("school");
        table.string("location");
        table.integer("managedListingsTotalCount");
        table.string("guestType");
        table.boolean("isAvailable");
        table.boolean("isSuperhost");
        table.boolean("isVerified");
        table.boolean("completeOnboarding").defaultTo(false);
        table.timestamp("lastActivedAt").defaultTo(knex.fn.now());
        table.timestamp("registeredAt").defaultTo(knex.fn.now());
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
      })
      // SOCIAL
      .createTable("social_connect", function (table) {
        table.increments();
        table
          .integer("userId")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("user")
          .onDelete("cascade");
        table.string("provider");
        table.string("providerToken");
        table.timestamp("createdAt ").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
      })
      // LISTING
      .createTable("listing", (table) => {
        table.increments("id").primary();
        table
          .integer("userId")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("user")
          .onDelete("cascade");
        table.string("name", 255);
        table.string("title", 255);
        table.integer("price").defaultTo(0);
        table.integer("bedroom").defaultTo(0);
        table.integer("bedCount").defaultTo(0);
        table.integer("bathroom").defaultTo(0);
        table.string("description", 500);
        table.string("latitude");
        table.string("longitude");
        table.string("city");
        table.boolean("isActive").defaultTo(false);
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
      })
      // PICTURES
      .createTable("explore_picture", (table) => {
        table.increments("id").primary();
        table.string("caption");
        table.string("originalPicture");
        table.string("picture");
        table
          .integer("listingId")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("listing")
          .onDelete("cascade");
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
      })
  );
};

exports.down = (knex) => {
  return knex.schema
    .dropTable("explore_picture")
    .dropTable("listing")
    .dropTable("social_connect")
    .dropTable("user");
};
