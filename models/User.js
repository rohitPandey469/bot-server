import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const SECRET = process.env.SECRET || "SECRET";

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Not Valid Email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  joinedOn: {
    type: Date,
    default: Date.now,
  },
  about: {
    type: String,
  },
  score: {
    type: Number,
    default: 0,
  },
  badge: {
    type: String,
    enum:['Newbie','Pro','Expert'],
    default: 'Newbie',
  },
  answersGiven: {
    type: Number,
    default: 0,
  },
  // tokens: [
  //   {
  //     token: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  // ],
});

// pre hook - hash password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// method - generate Auth Token
userSchema.methods.generateAuthToken = async function () {
  // "this" refers to the specific User model object
  try {
    let newtoken = jwt.sign({ email: this.email, id: this._id }, SECRET, {
      expiresIn: "1h",
    });

    // mulitple token addition
    // this.tokens = this.tokens.concat({ token: newtoken });
    // await this.save();
    return newtoken;
  } catch (error) {
    res.status(400).json(error);
  }
};

export default mongoose.model("User", userSchema);
