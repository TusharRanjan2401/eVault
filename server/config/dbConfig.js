const mongoose = require("mongoose");

mongoose
  .connect(process.env.mongo_url)
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((err) => {
    console.log("Error in connecting bd", err.message);
  });

// const connectionResult = mongoose.connection;

// connectionResult.on("error", () => {
//   console.log(console, "connection error: ");
// });

// connectionResult.on("connected", () => {
//   console.log("connected to db");
// });

// module.exports = connectionResult;
