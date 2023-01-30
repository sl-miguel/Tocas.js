import { Schema, model } from "mongoose";

const LevelDB = new Schema({
    GuildId: String,
    UserId: String,
    Level: Number,
    Xp: Number
});

export default model["LevelDB"] || model("LevelDB", LevelDB);