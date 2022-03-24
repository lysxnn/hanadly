const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const conceptSchema = new Schema(
  {
    concept: {
      type: String,
      required: [true, "Name of the concept is required."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    contact: {
      type: String,
    },
    email: {
      type: String,
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Concept = model("Idea", conceptSchema);

module.exports = Concept;
