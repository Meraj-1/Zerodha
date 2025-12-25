// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     googleId: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     avatar: {
//         type: String,
//         required: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// })

// export default mongoose.model('User', userSchema);
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    avatar: {
      type: String,
      default: function() {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=random&color=fff&size=128`;
      }
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    phone: {
      type: String,
      default: null
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null
    },

    password: {
      type: String,
      default: null
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      required: true
    },

    googleId: {
      type: String,
      default: null,
      sparse: true
    },

    isGoogleConnected: {
      type: Boolean,
      default: false
    },

    balance: {
      type: Number,
      default: 0
    }
  },
  { 
    timestamps: true,
    bufferCommands: false,
    bufferMaxEntries: 0
  }
);

export default mongoose.model("User", userSchema);
