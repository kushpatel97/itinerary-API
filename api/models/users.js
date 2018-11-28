const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  _id: mongoose.Types.ObjectId,
  name: {
    first_name: { type: String, trim: true },
    last_name: { type: String, trim: true }
  },
  email: {
    type: String,
    trim: true
  },
  password: { type: String }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
