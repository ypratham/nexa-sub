import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Optional for OAuth users
    },
    monthlyBudget: {
      type: Number,
      default: 1000,
    },
    currency: {
      type: String,
      default: "USD",
    },
    provider: {
      type: String,
      default: "credentials",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.User || mongoose.model("User", UserSchema)
