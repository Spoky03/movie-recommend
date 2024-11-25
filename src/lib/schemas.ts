async function createUsersCollection(db : any) {
  try {
    await db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["username", "password"],
          properties: {
            username: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            password: {
              bsonType: "string",
              description: "must be a string and is required",
            },
          },
        },
      },
    });
    console.log("Users collection created with validation");
  } catch (error) {
    console.error("Failed to create collection", error);
  }
}

export { createUsersCollection };
