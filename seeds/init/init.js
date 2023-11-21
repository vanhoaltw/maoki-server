/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("user").del();
  await knex("user").insert([
    {
      id: 1,
      firstName: "John",
      lastName: "Johnson",
      username: "john",
      email: "join@gmail.com",
      passwordHash: "",
      bio: "Test user",
    },
  ]);

  await knex("listing").del();
  await knex("listing").insert([
    {
      id: 1,
      userId: 1,
      name: "Phòng tại quận 1",
      title: "Cozy homestay next to Bui Vien",
      description: "Mo ta homestay",
      price: 100,
      bedroom: 1,
      bedCount: 2,
      bathroom: 1,
      latitude: 100,
      longitude: 200,
      city: "ho chi minh",
      isActive: true,
    },
  ]);

  await knex("explore_picture").del();
  await knex("explore_picture").insert([
    {
      id: 1,
      listingId: 1,
      caption: "Chichken",
      originalPicture: "",
      picture:
        "https://image-us.24h.com.vn/upload/1-2022/images/2022-03-26/yua-mikami-2-1648292822-587-width640height480.jpg",
    },
  ]);
};
