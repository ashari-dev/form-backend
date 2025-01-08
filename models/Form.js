import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

FormSchema.plugin(mongoosePaginate);

export default mongoose.model("Form", FormSchema);
