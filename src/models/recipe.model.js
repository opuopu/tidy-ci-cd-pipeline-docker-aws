import { Schema, model } from "mongoose";

const recipeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "recipe name is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cookingTime: {
      type: String,
      required: [true, "cooking time is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    ingredients: [
      {
        type: String,
        required: [true, "ingredient is required"],
      },
    ],
    steps: [
      {
        type: String,
        required: [true, "steps is required"],
      },
    ],
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tags",
      },
    ],
    favouriteList: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

const Recipe = model("Recipe", recipeSchema);
export default Recipe;
