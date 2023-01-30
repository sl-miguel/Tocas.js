import { Schema, model } from "mongoose";

const DisableDB = new Schema({
    Id: String,
});

export default model["DisableDB"] || model("DisableDB", DisableDB);