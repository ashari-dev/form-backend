import mongoose from "mongoose";

const FormSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    question: {
      type: Array,
    },
    invites: {
      type: Array,
    },
    public: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Number,
    },
    updatedAt: {
      type: Number,
    },
  },
  {
    timestamps: {
      currentTime: () => Math.floor(Date.now() / 1000),
    },
  }
);

export default mongoose.model("Form", FormSchema);
