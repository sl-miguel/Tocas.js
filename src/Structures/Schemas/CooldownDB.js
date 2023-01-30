import { Schema, model } from "mongoose";

const CooldownDB = new Schema({
    Id: String,
    Expires: Date,
});

export default model["CooldownDB"] || model("CooldownDB", CooldownDB);