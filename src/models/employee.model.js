import { Schema, model, Types } from "mongoose";

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "employee name is required"],
    },
    homeOwner: {
      type: Types.ObjectId,
      ref: "HomeOwner",
      required: [true, "homeOwner inforamtion is required"],
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "user inforamtion is required"],
    },
    image: {
      type: String,
    },
    cpr: {
      cprNumber: {
        type: Number,
      },
      expireDate: {
        type: Date,
      },
    },
    passport: {
      passportNumber: {
        type: Number,
      },
      expireDate: {
        type: Date,
      },
    },

    // access:{

    // }
  },
  {
    timestamps: true,
  }
);

const Employee = model("Employee", employeeSchema);
export default Employee;
