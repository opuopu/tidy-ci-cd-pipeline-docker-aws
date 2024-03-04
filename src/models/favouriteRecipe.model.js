import { Schema, model, Types } from "mongoose";

const FavouriteRecipeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    lists: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const FavouriteRecipe = model("FavouriteRecipe", FavouriteRecipeSchema);
export default FavouriteRecipe;
