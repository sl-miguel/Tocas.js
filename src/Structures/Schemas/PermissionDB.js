import { Schema, model } from "mongoose";

const PermissionDB = new Schema({
    Id: String,
    Permissions: [String],
});

export default model["PermissionDB"] || model("PermissionDB", PermissionDB);