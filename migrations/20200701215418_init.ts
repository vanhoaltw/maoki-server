exports.up = (knex) => {
  return (
    knex.schema
      // USER
      .createTable("user", (table) => {
        table.increments("id").primary();
        table.string("firstName", 255).notNullable();
        table.string("lastName", 255).notNullable();
        table.string("username", 255).notNullable();
        table.string("email", 50).notNullable();
        table.boolean("emailVerified").defaultTo(false);
        table.string("passwordHash", 32).notNullable();
        table.timestamp("birthday");
        table.string("bio");
        table.string("gender");
        table.string("avatar");
        table.string("address");
        table.boolean("isAvailable");
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
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
      })
      // BOOKING
      .createTable("booking", (table) => {
        table.increments("id").primary();
        table
          .integer("userId")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("user")
          .onDelete("cascade");
        table.string("name", 255).notNullable();
        table.string("slug").notNullable();
        table.boolean("isActive").defaultTo(false);
        table.integer("price").notNullable().defaultTo(0);
        table.string("customer");
        table.integer("bedroom").defaultTo(0);
        table.integer("bedCount").defaultTo(0);
        table.integer("bathrom").defaultTo(0);
        table.string("description", 500);
        table.string("convenient");
        table.string("latitude");
        table.string("longitude");
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
      })
      // THUMBNAIL
      .createTable("media", (table) => {
        table.increments("id").primary();
        table.integer("position").defaultTo(0);
        table.string("name");
        table.enum("type", ["image", "video"]).defaultTo("image");
        table
          .integer("bookingId")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("booking")
          .onDelete("cascade");
        table.string("path");
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
      })
      // BLOG
      .createTable("blog", (table) => {
        table.increments("id").primary();
        table
          .integer("userId")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("user")
          .onDelete("cascade");
        table.string("content");
        table.enum("status", ["draft", "published", "private"]);
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
      })
  );
};

exports.down = (knex) => {
  return (
    knex.schema
      .dropTable("blog")
      .dropTable("media")
      .dropTable("booking")
      .dropTable("social_connect")
      .dropTable("user")
  );
};
