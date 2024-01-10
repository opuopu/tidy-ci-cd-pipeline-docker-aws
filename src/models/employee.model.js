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
    image: {
      publicUrl: {
        type: String,
      },
      path: {
        type: String,
      },
    },
    cpr: {
      cprNumber: {
        type: Number,
      },
      expireDate: {
        type: Date,
      },
      reminder: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Employee = model("Employee", employeeSchema);
export default Employee;
