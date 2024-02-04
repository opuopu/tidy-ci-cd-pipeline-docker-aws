import { Schema, model, Types } from "mongoose";

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "employee name is required"],
    },
    phone: {
      type: Number,
      required: [true, "employee phoneNumber is required"],
    },
    email: {
      type: String,
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
    },
    passport: {
      passportNumber: {
        type: Number,
      },
      expireDate: {
        type: Date,
      },
    },
    password: {
      type: String,
      default: "123456",
    },
    passwordChangedAt: {
      type: Date,
    },
    needPassWordChange: {
      type: Boolean,
      default: true,
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
