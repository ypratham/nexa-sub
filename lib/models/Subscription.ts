import mongoose from "mongoose"

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    renewalDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: String,
      enum: ["monthly", "quarterly", "annually", "custom"],
      default: "monthly",
    },
    customCycle: {
      type: Number,
      default: null, // Number of months for custom cycle
    },
    logoUrl: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "Other",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema)
