const { default: mongoose } = require("mongoose");
const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const eventSchema = new Schema(
  {
    eventname: {
      type: String,
      required: [true, "Eventname is required."],
    },
    date: {
      type: Date,
      required: [true, "Date is required."],
    },
    eventtype: {
      type: String,
      required: [true, "Eventtype is required."],
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
      required: [true, "Email is required."],
    },
    eventowner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Event = model("Event", eventSchema);

module.exports = Event;
