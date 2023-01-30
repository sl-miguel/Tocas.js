import { Schema, model } from "mongoose";

const LanguageDB = new Schema({
    GuildId: String,
    Language: String,
});

export default model["LanguageDB"] || model("LanguageDB", LanguageDB);