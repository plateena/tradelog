import mongoose from "mongoose";

// Establish connection to MongoDB
mongoose
  .connect("mongodb://mongodb/test-db", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

export default mongoose.connection;
