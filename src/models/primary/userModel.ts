import mongoose, { Document, Model, Schema, Types } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { primaryConnection } from "../../loaders/config";

export interface IUser extends Document {
  _no: number;
  user_id: string;
  name: string;
  email: string;
  number: string;
  user: string;
  password: string;
  role: string;
  isActive: boolean;
  status: string;
  images_id: Types.ObjectId;
  audit_log: Types.ObjectId;
  is_active?: string; // Optional field
  is_delete?: string; // Optional field
  getJWT_token: () => Promise<string>;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    _no: {
      type: Number,
      default:0,
    },
    user_id: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
    },
    number: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Email is required"],
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "manager", "employee"],
      default: "employee",
    },
    isActive: {
      type: Boolean,
      default: false, // Active by default
    },
    images_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "Images",
      },
    ],
    status: {
      type: String,
      default: "active",
    },
    audit_log: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    is_active: {
      type: String,
      default: "yes",
    },
    is_delete: {
      type: String,
      default: "no",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err as Error);
  }
});
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getJWT_token = async function (): Promise<string> {
  const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

  // Create and return the JWT token
  const token = jwt.sign(
    {
      id: this._id, // You can include any data you want in the token
      email: this.email,
    },
    JWT_SECRET,
    { expiresIn: "1h" } // Set token expiration (1 hour in this case)
  );

  return token;
};
const User: Model<IUser> = primaryConnection.model<IUser>("User", userSchema);
export default User;
