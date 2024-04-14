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
    reminder: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "user inforamtion is required"],
    },
    id: {
      type: String,
      required: [true, "employee id is required"],
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

    access: [
      {
        type: String,
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);
// filter out deleted documents
employeeSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

employeeSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
employeeSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const Employee = model("Employee", employeeSchema);
export default Employee;
