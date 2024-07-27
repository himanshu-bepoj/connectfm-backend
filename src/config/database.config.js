const mongoose = require("mongoose");
const dotenv = require("dotenv/config");

(async () => {
  try {
    const database = await mongoose.connect(process.env.MONGODB_URI);
    if (!database) {
      console.log(`Error connecting with MongoDB`);
    }

    const connectionString = database.connection._connectionString;
    console.log(`Successfully connected with MongoDB`);
  } catch (error) {
    console.log(`Error connecting with MongoDB ${error}`);
  }
})();

module.exports = mongoose.connection;