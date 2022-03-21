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
    contact: {
      email: {
        type: String,
        required: [true, "Email is required."],
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      },
      description: {
        type: String,
        required: [true, "Description is required."],
      },
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Event = model("Event", eventSchema);

module.exports = Event;
