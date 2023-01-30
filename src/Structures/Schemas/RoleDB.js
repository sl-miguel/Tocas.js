import { Schema, model } from "mongoose";

const RoleDB = new Schema({
    Id: String,
    Roles: [String],
});

export default model["RoleDB"] || model("RoleDB", RoleDB);