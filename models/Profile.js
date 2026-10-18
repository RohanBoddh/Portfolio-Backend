const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    tagline: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },

    education: [
      {
        degree: String,
        institution: String,
        duration: String,
        location: String,
        description: String,
      },
    ],

    skills: [
      {
        name: String,
        level: String,
      },
    ],

    services: [
      {
        title: String,
        description: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", profileSchema);